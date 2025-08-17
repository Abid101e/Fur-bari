import { Post, IPost } from './post.model.js';
import { User } from '../users/user.model.js';
import { Types } from 'mongoose';

export class PostService {
  // Create a new post
  static async createPost(postData: Partial<IPost>, ownerId: string) {
    try {
      const post = new Post({
        ...postData,
        owner: ownerId,
        status: 'draft',
        isApproved: false,
      });

      await post.save();
      await post.populate('owner', 'name email avatar');

      return {
        success: true,
        message: 'Post created successfully',
        data: { post },
      };
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  // Get posts with filtering and pagination
  static async getPosts(options: {
    page?: number;
    limit?: number;
    search?: string;
    species?: string;
    size?: string;
    gender?: string;
    age?: string;
    city?: string;
    state?: string;
    status?: string;
    urgency?: string;
    minFee?: number;
    maxFee?: number;
    isVaccinated?: boolean;
    isNeutered?: boolean;
    goodWithChildren?: boolean;
    goodWithDogs?: boolean;
    goodWithCats?: boolean;
    energy?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    featured?: boolean;
    ownerId?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        species,
        size,
        gender,
        age,
        city,
        state,
        status = 'active',
        urgency,
        minFee,
        maxFee,
        isVaccinated,
        isNeutered,
        goodWithChildren,
        goodWithDogs,
        goodWithCats,
        energy,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        featured,
        ownerId
      } = options;

      // Build filter object
      const filter: any = {};

      // Only show approved posts for public view
      if (!ownerId) {
        filter.isApproved = true;
      }

      if (status) {
        filter.status = status;
      }

      if (ownerId) {
        filter.owner = ownerId;
      }

      if (search) {
        filter.$text = { $search: search };
      }

      if (species) {
        filter['pet.species'] = species;
      }

      if (size) {
        filter['pet.size'] = size;
      }

      if (gender) {
        filter['pet.gender'] = gender;
      }

      if (age) {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        switch (age) {
          case 'young': // 0-2 years
            filter.$or = [
              { 'pet.age.unit': 'months' },
              { 'pet.age.unit': 'years', 'pet.age.value': { $lte: 2 } }
            ];
            break;
          case 'adult': // 2-7 years
            filter['pet.age.unit'] = 'years';
            filter['pet.age.value'] = { $gt: 2, $lte: 7 };
            break;
          case 'senior': // 7+ years
            filter['pet.age.unit'] = 'years';
            filter['pet.age.value'] = { $gt: 7 };
            break;
        }
      }

      if (city) {
        filter['location.city'] = new RegExp(city, 'i');
      }

      if (state) {
        filter['location.state'] = new RegExp(state, 'i');
      }

      if (urgency) {
        filter.urgency = urgency;
      }

      if (minFee !== undefined || maxFee !== undefined) {
        filter.adoptionFee = {};
        if (minFee !== undefined) filter.adoptionFee.$gte = minFee;
        if (maxFee !== undefined) filter.adoptionFee.$lte = maxFee;
      }

      if (typeof isVaccinated === 'boolean') {
        filter['pet.isVaccinated'] = isVaccinated;
      }

      if (typeof isNeutered === 'boolean') {
        filter['pet.isNeutered'] = isNeutered;
      }

      if (typeof goodWithChildren === 'boolean') {
        filter['pet.goodWith.children'] = goodWithChildren;
      }

      if (typeof goodWithDogs === 'boolean') {
        filter['pet.goodWith.dogs'] = goodWithDogs;
      }

      if (typeof goodWithCats === 'boolean') {
        filter['pet.goodWith.cats'] = goodWithCats;
      }

      if (energy) {
        filter['pet.energy'] = energy;
      }

      if (featured) {
        filter.featuredUntil = { $gt: new Date() };
      }

      // Build sort object
      const sort: any = {};
      
      if (featured) {
        sort.featuredUntil = -1; // Featured posts first
      }
      
      if (search) {
        sort.score = { $meta: 'textScore' };
      }
      
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query
      const [posts, total] = await Promise.all([
        Post.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('owner', 'name email avatar phone location')
          .populate('approvedBy', 'name'),
        Post.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Posts retrieved successfully',
        data: {
          posts,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          filters: {
            search,
            species,
            size,
            gender,
            age,
            city,
            state,
            status,
            urgency,
            minFee,
            maxFee,
            sortBy,
            sortOrder,
          },
        },
      };
    } catch (error) {
      throw new Error(`Failed to get posts: ${error.message}`);
    }
  }

  // Get single post by ID
  static async getPostById(postId: string, userId?: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId)
        .populate('owner', 'name email avatar phone location')
        .populate('approvedBy', 'name');

      if (!post) {
        throw new Error('Post not found');
      }

      // Only show non-approved posts to owner or admin
      if (!post.isApproved && post.owner._id.toString() !== userId) {
        const user = userId ? await User.findById(userId) : null;
        if (!user || user.role !== 'admin') {
          throw new Error('Post not found');
        }
      }

      // Increment views if this is not the owner viewing
      if (userId !== post.owner._id.toString()) {
        await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });
      }

      return {
        success: true,
        message: 'Post retrieved successfully',
        data: { post },
      };
    } catch (error) {
      throw new Error(`Failed to get post: ${error.message}`);
    }
  }

  // Update post
  static async updatePost(postId: string, updateData: Partial<IPost>, userId: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      // Check ownership or admin role
      const user = await User.findById(userId);
      if (post.owner.toString() !== userId && user?.role !== 'admin') {
        throw new Error('Access denied');
      }

      // If post was approved and content changes, require re-approval
      const contentFields = ['title', 'description', 'pet', 'location'];
      const hasContentChange = contentFields.some(field => updateData[field] !== undefined);
      
      if (hasContentChange && post.isApproved) {
        updateData.isApproved = false;
        updateData.approvedBy = undefined;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('owner', 'name email avatar');

      return {
        success: true,
        message: 'Post updated successfully',
        data: { post: updatedPost },
      };
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }

  // Update post status
  static async updatePostStatus(postId: string, status: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      // Check ownership
      if (post.owner.toString() !== userId) {
        throw new Error('Access denied');
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { status },
        { new: true, runValidators: true }
      ).populate('owner', 'name email avatar');

      return {
        success: true,
        message: 'Post status updated successfully',
        data: { post: updatedPost },
      };
    } catch (error) {
      throw new Error(`Failed to update post status: ${error.message}`);
    }
  }

  // Delete post
  static async deletePost(postId: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      // Check ownership or admin role
      const user = await User.findById(userId);
      if (post.owner.toString() !== userId && user?.role !== 'admin') {
        throw new Error('Access denied');
      }

      await Post.findByIdAndDelete(postId);

      return {
        success: true,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }

  // Toggle favorite
  static async toggleFavorite(postId: string, userId: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      const userObjectId = new Types.ObjectId(userId);
      const isFavorited = post.favorites.includes(userObjectId);

      let updatedPost;
      if (isFavorited) {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $pull: { favorites: userObjectId } },
          { new: true }
        );
      } else {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $addToSet: { favorites: userObjectId } },
          { new: true }
        );
      }

      return {
        success: true,
        message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
        data: {
          isFavorited: !isFavorited,
          favoritesCount: updatedPost?.favorites.length || 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to toggle favorite: ${error.message}`);
    }
  }

  // Get user's favorite posts
  static async getFavorites(userId: string, page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        Post.find({
          favorites: userId,
          isApproved: true,
          status: 'active',
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('owner', 'name email avatar'),
        Post.countDocuments({
          favorites: userId,
          isApproved: true,
          status: 'active',
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Favorite posts retrieved successfully',
        data: {
          posts,
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
      throw new Error(`Failed to get favorites: ${error.message}`);
    }
  }

  // Moderate post (admin only)
  static async moderatePost(postId: string, action: 'approve' | 'reject', moderatorId: string, reason?: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      const updateData: any = {};

      if (action === 'approve') {
        updateData.isApproved = true;
        updateData.approvedBy = moderatorId;
        updateData.status = 'active';
        updateData.rejectionReason = undefined;
      } else {
        updateData.isApproved = false;
        updateData.status = 'removed';
        updateData.rejectionReason = reason || 'Post does not meet community guidelines';
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        updateData,
        { new: true, runValidators: true }
      ).populate('owner', 'name email')
        .populate('approvedBy', 'name');

      return {
        success: true,
        message: `Post ${action}d successfully`,
        data: { post: updatedPost },
      };
    } catch (error) {
      throw new Error(`Failed to ${action} post: ${error.message}`);
    }
  }

  // Get posts statistics
  static async getPostStats() {
    try {
      const [
        totalPosts,
        activePosts,
        pendingApproval,
        adoptedPosts,
        featuredPosts,
        recentPosts
      ] = await Promise.all([
        Post.countDocuments(),
        Post.countDocuments({ status: 'active', isApproved: true }),
        Post.countDocuments({ isApproved: false, status: { $ne: 'removed' } }),
        Post.countDocuments({ status: 'adopted' }),
        Post.countDocuments({ featuredUntil: { $gt: new Date() } }),
        Post.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
        })
      ]);

      const speciesStats = await Post.aggregate([
        { $match: { status: 'active', isApproved: true } },
        { $group: { _id: '$pet.species', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      return {
        success: true,
        message: 'Post statistics retrieved successfully',
        data: {
          totalPosts,
          activePosts,
          pendingApproval,
          adoptedPosts,
          featuredPosts,
          recentPosts,
          speciesBreakdown: speciesStats,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get post statistics: ${error.message}`);
    }
  }
}
