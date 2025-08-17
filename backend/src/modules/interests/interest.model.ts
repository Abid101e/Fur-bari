import mongoose, { Document, Schema } from 'mongoose';

export interface IInterest extends Document {
  applicant: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  status: 'pending' | 'shortlisted' | 'approved' | 'rejected' | 'withdrawn';
  message: string;
  applicantInfo: {
    experience: string;
    livingSpace: 'apartment' | 'house' | 'farm' | 'other';
    hasYard: boolean;
    hasOtherPets: boolean;
    otherPetsInfo?: string;
    hasChildren: boolean;
    childrenAges?: number[];
    workSchedule: string;
    veterinarian?: string;
    references?: string[];
  };
  ownerResponse?: {
    message: string;
    respondedAt: Date;
    requestedDocuments?: string[];
    meetingScheduled?: Date;
    meetingLocation?: string;
  };
  documents: {
    type: 'id' | 'income' | 'housing' | 'veterinary' | 'reference' | 'other';
    url: string;
    uploadedAt: Date;
  }[];
  timeline: {
    action: 'applied' | 'shortlisted' | 'approved' | 'rejected' | 'withdrawn' | 'documents_requested' | 'documents_submitted' | 'meeting_scheduled';
    date: Date;
    message?: string;
    performedBy: mongoose.Types.ObjectId;
  }[];
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const interestSchema = new Schema<IInterest>({
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant is required'],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'shortlisted', 'approved', 'rejected', 'withdrawn'],
      message: 'Invalid interest status',
    },
    default: 'pending',
  },
  message: {
    type: String,
    required: [true, 'Application message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  applicantInfo: {
    experience: {
      type: String,
      required: [true, 'Pet experience information is required'],
      maxlength: [1000, 'Experience description cannot exceed 1000 characters'],
    },
    livingSpace: {
      type: String,
      required: [true, 'Living space type is required'],
      enum: {
        values: ['apartment', 'house', 'farm', 'other'],
        message: 'Invalid living space type',
      },
    },
    hasYard: {
      type: Boolean,
      required: true,
      default: false,
    },
    hasOtherPets: {
      type: Boolean,
      required: true,
      default: false,
    },
    otherPetsInfo: {
      type: String,
      maxlength: [500, 'Other pets info cannot exceed 500 characters'],
    },
    hasChildren: {
      type: Boolean,
      required: true,
      default: false,
    },
    childrenAges: [{
      type: Number,
      min: [0, 'Invalid age'],
      max: [18, 'Invalid age'],
    }],
    workSchedule: {
      type: String,
      required: [true, 'Work schedule is required'],
      maxlength: [500, 'Work schedule cannot exceed 500 characters'],
    },
    veterinarian: {
      type: String,
      maxlength: [200, 'Veterinarian info cannot exceed 200 characters'],
    },
    references: [{
      type: String,
      maxlength: [200, 'Reference cannot exceed 200 characters'],
    }],
  },
  ownerResponse: {
    message: {
      type: String,
      maxlength: [1000, 'Response message cannot exceed 1000 characters'],
    },
    respondedAt: Date,
    requestedDocuments: [{
      type: String,
    }],
    meetingScheduled: Date,
    meetingLocation: {
      type: String,
      maxlength: [500, 'Meeting location cannot exceed 500 characters'],
    },
  },
  documents: [{
    type: {
      type: String,
      enum: ['id', 'income', 'housing', 'veterinary', 'reference', 'other'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  timeline: [{
    action: {
      type: String,
      enum: ['applied', 'shortlisted', 'approved', 'rejected', 'withdrawn', 'documents_requested', 'documents_submitted', 'meeting_scheduled'],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    message: String,
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }],
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Invalid priority level',
    },
    default: 'medium',
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
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
interestSchema.index({ applicant: 1, post: 1 }, { unique: true }); // One application per user per post
interestSchema.index({ post: 1, status: 1 });
interestSchema.index({ applicant: 1, status: 1 });
interestSchema.index({ createdAt: -1 });
interestSchema.index({ status: 1, priority: -1 });

// Middleware
interestSchema.pre('save', function(next) {
  // Add timeline entry for status changes
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      action: this.status as any,
      date: new Date(),
      performedBy: this.applicant, // Default to applicant, service should override this
    });
  }
  next();
});

// Prevent duplicate applications
interestSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await mongoose.model('Interest').findOne({
      applicant: this.applicant,
      post: this.post,
    });
    
    if (existing) {
      const error = new Error('You have already applied for this post');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

export const Interest = mongoose.model<IInterest>('Interest', interestSchema);
