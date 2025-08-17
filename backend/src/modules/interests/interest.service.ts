import { Interest, IInterest } from './interest.model.js';
import { Post } from '../posts/post.model.js';
import { User } from '../users/user.model.js';
import { Types } from 'mongoose';

export class InterestService {
  // Create a new adoption application
  static async createInterest(interestData: {
    postId: string;
    message: string;
    applicantInfo: any;
  }, applicantId: string) {
    try {
      // Check if post exists and is active
      const post = await Post.findById(interestData.postId);
      if (!post) {
        throw new Error('Post not found');
      }

      if (post.status !== 'active' || !post.isApproved) {
        throw new Error('This post is not available for adoption applications');
      }

      // Check if user is trying to apply for their own post
      if (post.owner.toString() === applicantId) {
        throw new Error('You cannot apply for your own post');
      }

      // Create the interest
      const interest = new Interest({
        applicant: applicantId,
        post: interestData.postId,
        message: interestData.message,
        applicantInfo: interestData.applicantInfo,
        timeline: [{
          action: 'applied',
          date: new Date(),
          performedBy: applicantId,
        }],
      });

      await interest.save();
      await interest.populate([
        { path: 'applicant', select: 'name email avatar phone' },
        { path: 'post', select: 'title pet.name pet.species' }
      ]);

      return {
        success: true,
        message: 'Application submitted successfully',
        data: { interest },
      };
    } catch (error) {
      throw new Error(`Failed to create application: ${error.message}`);
    }
  }

  // Get interests for a post (for post owners)
  static async getInterestsForPost(postId: string, ownerId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const { page = 1, limit = 10, status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = options;

      // Verify post ownership
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      if (post.owner.toString() !== ownerId) {
        throw new Error('Access denied');
      }

      // Build filter
      const filter: any = { post: postId };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;

      // Build sort
      const sort: any = {};
      if (sortBy === 'priority') {
        sort.priority = sortOrder === 'asc' ? 1 : -1;
        sort.createdAt = -1; // Secondary sort
      } else {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      }

      const skip = (page - 1) * limit;

      const [interests, total] = await Promise.all([
        Interest.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('applicant', 'name email avatar phone location')
          .populate('post', 'title pet.name pet.species'),
        Interest.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Interests retrieved successfully',
        data: {
          interests,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to get interests: ${error.message}`);
    }
  }

  // Get user's applications
  static async getMyInterests(applicantId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;

      const filter: any = { applicant: applicantId };
      if (status) filter.status = status;

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (page - 1) * limit;

      const [interests, total] = await Promise.all([
        Interest.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('post', 'title pet.name pet.species pet.photos status owner')
          .populate('post.owner', 'name'),
        Interest.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Your applications retrieved successfully',
        data: {
          interests,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to get applications: ${error.message}`);
    }
  }

  // Update interest status (for post owners)
  static async updateInterestStatus(
    interestId: string, 
    updateData: {
      status: string;
      message?: string;
      requestedDocuments?: string[];
      meetingScheduled?: string;
      meetingLocation?: string;
    }, 
    userId: string
  ) {
    try {
      const interest = await Interest.findById(interestId).populate('post');
      if (!interest) {
        throw new Error('Application not found');
      }

      // Verify post ownership
      const post = interest.post as any; // Type assertion for populated field
      if (post.owner.toString() !== userId) {
        throw new Error('Access denied');
      }

      // Update interest
      interest.status = updateData.status as any;
      
      if (updateData.message || updateData.requestedDocuments || updateData.meetingScheduled || updateData.meetingLocation) {
        interest.ownerResponse = {
          message: updateData.message || '',
          respondedAt: new Date(),
          requestedDocuments: updateData.requestedDocuments,
          meetingScheduled: updateData.meetingScheduled ? new Date(updateData.meetingScheduled) : undefined,
          meetingLocation: updateData.meetingLocation,
        };
      }

      // Add timeline entry
      interest.timeline.push({
        action: updateData.status as any,
        date: new Date(),
        message: updateData.message,
        performedBy: new Types.ObjectId(userId),
      });

      await interest.save();
      await interest.populate([
        { path: 'applicant', select: 'name email avatar phone' },
        { path: 'post', select: 'title pet.name pet.species' }
      ]);

      return {
        success: true,
        message: 'Application status updated successfully',
        data: { interest },
      };
    } catch (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }
  }

  // Withdraw application (for applicants)
  static async withdrawInterest(interestId: string, applicantId: string) {
    try {
      const interest = await Interest.findById(interestId);
      if (!interest) {
        throw new Error('Application not found');
      }

      if (interest.applicant.toString() !== applicantId) {
        throw new Error('Access denied');
      }

      if (interest.status === 'approved') {
        throw new Error('Cannot withdraw an approved application');
      }

      interest.status = 'withdrawn';
      interest.timeline.push({
        action: 'withdrawn',
        date: new Date(),
        performedBy: new Types.ObjectId(applicantId),
      });

      await interest.save();

      return {
        success: true,
        message: 'Application withdrawn successfully',
      };
    } catch (error) {
      throw new Error(`Failed to withdraw application: ${error.message}`);
    }
  }

  // Get interest statistics
  static async getInterestStats() {
    try {
      const [
        totalInterests,
        pendingInterests,
        approvedInterests,
        rejectedInterests,
        recentInterests
      ] = await Promise.all([
        Interest.countDocuments(),
        Interest.countDocuments({ status: 'pending' }),
        Interest.countDocuments({ status: 'approved' }),
        Interest.countDocuments({ status: 'rejected' }),
        Interest.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
        })
      ]);

      return {
        success: true,
        message: 'Interest statistics retrieved successfully',
        data: {
          totalInterests,
          pendingInterests,
          approvedInterests,
          rejectedInterests,
          recentInterests,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get interest statistics: ${error.message}`);
    }
  }
}
