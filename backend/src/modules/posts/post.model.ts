import mongoose, { Document, Schema } from 'mongoose';

export interface IPet {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  age: {
    value: number;
    unit: 'months' | 'years';
  };
  gender: 'male' | 'female' | 'unknown';
  size: 'small' | 'medium' | 'large' | 'extra-large';
  color: string;
  weight?: number;
  isVaccinated: boolean;
  isNeutered: boolean;
  healthStatus: 'excellent' | 'good' | 'fair' | 'needs-attention';
  medicalHistory?: string;
  temperament: string[];
  goodWith: {
    children: boolean;
    dogs: boolean;
    cats: boolean;
    strangers: boolean;
  };
  energy: 'low' | 'moderate' | 'high';
  photos: string[];
}

export interface IPost extends Document {
  title: string;
  description: string;
  pet: IPet;
  owner: mongoose.Types.ObjectId;
  status: 'draft' | 'active' | 'paused' | 'adopted' | 'removed';
  location: {
    address?: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  adoptionFee?: number;
  requirements?: string;
  contactPreference: 'app' | 'phone' | 'email';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  views: number;
  favorites: mongoose.Types.ObjectId[];
  featuredUntil?: Date;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const petSchema = new Schema<IPet>({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    maxlength: [50, 'Pet name cannot exceed 50 characters'],
  },
  species: {
    type: String,
    required: [true, 'Pet species is required'],
    enum: {
      values: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      message: 'Invalid pet species',
    },
  },
  breed: {
    type: String,
    trim: true,
    maxlength: [100, 'Breed name cannot exceed 100 characters'],
  },
  age: {
    value: {
      type: Number,
      required: [true, 'Pet age is required'],
      min: [0, 'Age cannot be negative'],
    },
    unit: {
      type: String,
      required: true,
      enum: {
        values: ['months', 'years'],
        message: 'Age unit must be months or years',
      },
    },
  },
  gender: {
    type: String,
    required: [true, 'Pet gender is required'],
    enum: {
      values: ['male', 'female', 'unknown'],
      message: 'Invalid gender',
    },
  },
  size: {
    type: String,
    required: [true, 'Pet size is required'],
    enum: {
      values: ['small', 'medium', 'large', 'extra-large'],
      message: 'Invalid size',
    },
  },
  color: {
    type: String,
    required: [true, 'Pet color is required'],
    trim: true,
    maxlength: [50, 'Color description cannot exceed 50 characters'],
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
  },
  isVaccinated: {
    type: Boolean,
    required: true,
    default: false,
  },
  isNeutered: {
    type: Boolean,
    required: true,
    default: false,
  },
  healthStatus: {
    type: String,
    required: true,
    enum: {
      values: ['excellent', 'good', 'fair', 'needs-attention'],
      message: 'Invalid health status',
    },
    default: 'good',
  },
  medicalHistory: {
    type: String,
    maxlength: [1000, 'Medical history cannot exceed 1000 characters'],
  },
  temperament: [{
    type: String,
    trim: true,
  }],
  goodWith: {
    children: { type: Boolean, default: false },
    dogs: { type: Boolean, default: false },
    cats: { type: Boolean, default: false },
    strangers: { type: Boolean, default: false },
  },
  energy: {
    type: String,
    required: true,
    enum: {
      values: ['low', 'moderate', 'high'],
      message: 'Invalid energy level',
    },
    default: 'moderate',
  },
  photos: [{
    type: String,
    required: true,
  }],
}, { _id: false });

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Post description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  pet: {
    type: petSchema,
    required: [true, 'Pet information is required'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post owner is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'active', 'paused', 'adopted', 'removed'],
      message: 'Invalid post status',
    },
    default: 'draft',
  },
  location: {
    address: String,
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'Bangladesh',
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude'],
      },
    },
  },
  adoptionFee: {
    type: Number,
    min: [0, 'Adoption fee cannot be negative'],
    default: 0,
  },
  requirements: {
    type: String,
    maxlength: [1000, 'Requirements cannot exceed 1000 characters'],
  },
  contactPreference: {
    type: String,
    enum: {
      values: ['app', 'phone', 'email'],
      message: 'Invalid contact preference',
    },
    default: 'app',
  },
  urgency: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'emergency'],
      message: 'Invalid urgency level',
    },
    default: 'medium',
  },
  views: {
    type: Number,
    default: 0,
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  featuredUntil: Date,
  isApproved: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: String,
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      if (ret.__v !== undefined) delete ret.__v;
      return ret;
    },
  },
});

// Indexes
postSchema.index({ owner: 1 });
postSchema.index({ status: 1 });
postSchema.index({ 'pet.species': 1 });
postSchema.index({ 'location.city': 1, 'location.state': 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isApproved: 1, status: 1 });
postSchema.index({ featuredUntil: 1 });
postSchema.index({ tags: 1 });

// Text search index
postSchema.index({
  title: 'text',
  description: 'text',
  'pet.name': 'text',
  'pet.breed': 'text',
});

// Middleware
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    // Auto-generate tags from title and description
    const text = `${this.title} ${this.description}`.toLowerCase();
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 10);
    
    this.tags = [...new Set([...this.tags, ...words])];
  }
  next();
});

export const Post = mongoose.model<IPost>('Post', postSchema);
