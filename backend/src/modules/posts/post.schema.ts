import { z } from 'zod';

// Pet schema
const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(50, 'Pet name cannot exceed 50 characters'),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other'], {
    required_error: 'Pet species is required',
  }),
  breed: z.string().max(100, 'Breed name cannot exceed 100 characters').optional(),
  age: z.object({
    value: z.number().min(0, 'Age cannot be negative'),
    unit: z.enum(['months', 'years']),
  }),
  gender: z.enum(['male', 'female', 'unknown']),
  size: z.enum(['small', 'medium', 'large', 'extra-large']),
  color: z.string().min(1, 'Pet color is required').max(50, 'Color cannot exceed 50 characters'),
  weight: z.number().min(0, 'Weight cannot be negative').optional(),
  isVaccinated: z.boolean().default(false),
  isNeutered: z.boolean().default(false),
  healthStatus: z.enum(['excellent', 'good', 'fair', 'needs-attention']).default('good'),
  medicalHistory: z.string().max(1000, 'Medical history cannot exceed 1000 characters').optional(),
  temperament: z.array(z.string()).default([]),
  goodWith: z.object({
    children: z.boolean().default(false),
    dogs: z.boolean().default(false),
    cats: z.boolean().default(false),
    strangers: z.boolean().default(false),
  }).default({}),
  energy: z.enum(['low', 'moderate', 'high']).default('moderate'),
  photos: z.array(z.string().url('Invalid photo URL')).min(1, 'At least one photo is required'),
});

// Location schema
const locationSchema = z.object({
  address: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('Bangladesh'),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
});

// Create post schema
export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
    description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
    pet: petSchema,
    location: locationSchema,
    adoptionFee: z.number().min(0, 'Adoption fee cannot be negative').default(0),
    requirements: z.string().max(1000, 'Requirements cannot exceed 1000 characters').optional(),
    contactPreference: z.enum(['app', 'phone', 'email']).default('app'),
    urgency: z.enum(['low', 'medium', 'high', 'emergency']).default('medium'),
    tags: z.array(z.string()).default([]),
  }),
});

// Update post schema
export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
    description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters').optional(),
    pet: petSchema.partial().optional(),
    location: locationSchema.partial().optional(),
    adoptionFee: z.number().min(0, 'Adoption fee cannot be negative').optional(),
    requirements: z.string().max(1000, 'Requirements cannot exceed 1000 characters').optional(),
    contactPreference: z.enum(['app', 'phone', 'email']).optional(),
    urgency: z.enum(['low', 'medium', 'high', 'emergency']).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// Update post status schema
export const updatePostStatusSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'active', 'paused', 'adopted', 'removed']),
  }),
});

// Get posts query schema
export const getPostsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other']).optional(),
    size: z.enum(['small', 'medium', 'large', 'extra-large']).optional(),
    gender: z.enum(['male', 'female', 'unknown']).optional(),
    age: z.enum(['young', 'adult', 'senior']).optional(), // young: 0-2 years, adult: 2-7 years, senior: 7+ years
    city: z.string().optional(),
    state: z.string().optional(),
    status: z.enum(['active', 'draft', 'paused', 'adopted', 'removed']).optional(),
    urgency: z.enum(['low', 'medium', 'high', 'emergency']).optional(),
    minFee: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxFee: z.string().regex(/^\d+$/).transform(Number).optional(),
    isVaccinated: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    isNeutered: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    goodWithChildren: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    goodWithDogs: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    goodWithCats: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    energy: z.enum(['low', 'moderate', 'high']).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'views', 'urgency', 'adoptionFee']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    featured: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  }),
});

// Admin approve/reject post schema
export const moderatePostSchema = z.object({
  body: z.object({
    action: z.enum(['approve', 'reject']),
    reason: z.string().optional(),
  }),
});

// Add to favorites schema
export const favoritePostSchema = z.object({
  params: z.object({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'),
  }),
});

// Export types
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type UpdatePostStatusInput = z.infer<typeof updatePostStatusSchema>;
export type GetPostsInput = z.infer<typeof getPostsSchema>;
export type ModeratePostInput = z.infer<typeof moderatePostSchema>;
export type FavoritePostInput = z.infer<typeof favoritePostSchema>;
