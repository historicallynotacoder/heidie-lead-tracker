import React from 'react';
import type { SortOption, FilterOption } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filterOption: FilterOption;
  onFilterChange: (option: FilterOption) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  filterOption,
  onFilterChange,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search Dashboard"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex gap-2">
        {/* Status Filter */}
        <select
          value={filterOption}
          onChange={(e) => onFilterChange(e.target.value as FilterOption)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="follow-up">Follow up</option>
          <option value="see-if-follow-up">See if follow up needed</option>
        </select>

        {/* Sort Options */}
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="alphabetical-asc">A-Z</option>
          <option value="alphabetical-desc">Z-A</option>
          <option value="recent-first">Most Recent</option>
          <option value="oldest-first">Least Recent</option>
        </select>
      </div>
    </div>
  );
};
