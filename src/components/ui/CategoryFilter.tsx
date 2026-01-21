'use client'

import { cn } from '@/lib/utils/cn'

export interface CategoryOption {
  label: string
  value: string
  count?: number
}

interface CategoryFilterProps {
  categories: CategoryOption[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  className?: string
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-2 scrollbar-hide',
        'md:flex-wrap md:justify-center',
        className
      )}
      role="tablist"
      aria-label="Project categories"
    >
      {/* All Projects Filter */}
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full',
          'font-medium text-sm whitespace-nowrap transition-all duration-300',
          'hover:scale-105 active:scale-95',
          activeCategory === 'all'
            ? 'bg-primary text-light shadow-lg'
            : 'bg-light text-dark border border-dark/10 hover:border-primary/30 hover:bg-primary/5'
        )}
        role="tab"
        aria-selected={activeCategory === 'all'}
        aria-controls="projects-grid"
      >
        All Projects
        {categories.reduce((acc, cat) => acc + (cat.count || 0), 0) > 0 && (
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              activeCategory === 'all'
                ? 'bg-light/20 text-light'
                : 'bg-dark/10 text-dark/70'
            )}
          >
            {categories.reduce((acc, cat) => acc + (cat.count || 0), 0)}
          </span>
        )}
      </button>

      {/* Category Filters */}
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full',
            'font-medium text-sm whitespace-nowrap transition-all duration-300',
            'hover:scale-105 active:scale-95',
            activeCategory === category.value
              ? 'bg-primary text-light shadow-lg'
              : 'bg-light text-dark border border-dark/10 hover:border-primary/30 hover:bg-primary/5'
          )}
          role="tab"
          aria-selected={activeCategory === category.value}
          aria-controls="projects-grid"
        >
          {category.label}
          {category.count !== undefined && category.count > 0 && (
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-semibold',
                activeCategory === category.value
                  ? 'bg-light/20 text-light'
                  : 'bg-dark/10 text-dark/70'
              )}
            >
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
