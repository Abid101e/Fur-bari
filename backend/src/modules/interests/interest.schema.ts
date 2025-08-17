import { z } from 'zod';

// Applicant info schema
const applicantInfoSchema = z.object({
  experience: z.string().min(1, 'Pet experience is required').max(1000, 'Experience cannot exceed 1000 characters'),
  livingSpace: z.enum(['apartment', 'house', 'farm', 'other']),
  hasYard: z.boolean().default(false),
  hasOtherPets: z.boolean().default(false),
  otherPetsInfo: z.string().max(500, 'Other pets info cannot exceed 500 characters').optional(),
  hasChildren: z.boolean().default(false),
  childrenAges: z.array(z.number().min(0).max(18)).optional(),
  workSchedule: z.string().min(1, 'Work schedule is required').max(500, 'Work schedule cannot exceed 500 characters'),
  veterinarian: z.string().max(200, 'Veterinarian info cannot exceed 200 characters').optional(),
  references: z.array(z.string().max(200, 'Reference cannot exceed 200 characters')).optional(),
});

// Create interest schema
export const createInterestSchema = z.object({
  body: z.object({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
    message: z.string().min(1, 'Application message is required').max(2000, 'Message cannot exceed 2000 characters'),
    applicantInfo: applicantInfoSchema,
  }),
});

// Update interest status schema
export const updateInterestStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'shortlisted', 'approved', 'rejected', 'withdrawn']),
    message: z.string().max(1000, 'Response message cannot exceed 1000 characters').optional(),
    requestedDocuments: z.array(z.string()).optional(),
    meetingScheduled: z.string().datetime().optional(),
    meetingLocation: z.string().max(500, 'Meeting location cannot exceed 500 characters').optional(),
  }),
});

// Get interests query schema
export const getInterestsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(['pending', 'shortlisted', 'approved', 'rejected', 'withdrawn']).optional(),
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'priority']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

// Upload document schema
export const uploadDocumentSchema = z.object({
  body: z.object({
    type: z.enum(['id', 'income', 'housing', 'veterinary', 'reference', 'other']),
    url: z.string().url('Invalid document URL'),
  }),
});

// Update interest notes schema
export const updateNotesSchema = z.object({
  body: z.object({
    notes: z.string().max(1000, 'Notes cannot exceed 1000 characters'),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

// Export types
export type CreateInterestInput = z.infer<typeof createInterestSchema>;
export type UpdateInterestStatusInput = z.infer<typeof updateInterestStatusSchema>;
export type GetInterestsInput = z.infer<typeof getInterestsSchema>;
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
export type UpdateNotesInput = z.infer<typeof updateNotesSchema>;
