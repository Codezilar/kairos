import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { productVariants } from '../variants';

export const conditions = pgTable('conditions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
});

export const conditionsRelations = relations(conditions, ({ many }) => ({
  variants: many(productVariants),
}));

export const insertConditionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const selectConditionSchema = insertConditionSchema.extend({
  id: z.string().uuid(),
});

export type InsertCondition = z.infer<typeof insertConditionSchema>;
export type SelectCondition = z.infer<typeof selectConditionSchema>;

export default conditions;
