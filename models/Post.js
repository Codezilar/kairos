import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  newPrice: {
    type: Number,
    min: 0,
    required: function() {
      return this.oldPrice !== undefined;
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  }],
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
postSchema.index({ category: 1 });
postSchema.index({ isPublished: 1 });
postSchema.index({ publishedAt: -1 });

// Virtual for discount percentage
postSchema.virtual('discountPercentage').get(function() {
  if (this.oldPrice && this.newPrice && this.oldPrice > this.newPrice) {
    const discount = ((this.oldPrice - this.newPrice) / this.oldPrice) * 100;
    return Math.round(discount);
  }
  return 0;
});

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);