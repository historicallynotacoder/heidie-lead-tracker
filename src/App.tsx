import { useEffect, useState } from 'react';
import type { LeadTracker, SortOption, FilterOption } from './types';
import { fetchAllLeads } from './services/supabase';
import { FilterBar } from './components/FilterBar';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';

function App() {
  const [leads, setLeads] = useState<LeadTracker[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadTracker[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadTracker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical-asc');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');

  // Fetch leads from Supabase
  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        const data = await fetchAllLeads();
        setLeads(data);
        setFilteredLeads(data);
      } catch (err) {
        setError('Failed to load leads. Please check your configuration.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...leads];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((lead) =>
        lead.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterOption !== 'all') {
      if (filterOption === 'follow-up') {
        result = result.filter((lead) => lead.action_item === 'Follow up');
      } else if (filterOption === 'see-if-follow-up') {
        result = result.filter(
          (lead) => lead.action_item === 'See if a follow up is needed'
        );
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'alphabetical-asc':
          return a.username.localeCompare(b.username);
        case 'alphabetical-desc':
          return b.username.localeCompare(a.username);
        case 'recent-first':
          return (
            new Date(b.recent_timestamp).getTime() -
            new Date(a.recent_timestamp).getTime()
          );
        case 'oldest-first':
          return (
            new Date(a.recent_timestamp).getTime() -
            new Date(b.recent_timestamp).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredLeads(result);
  }, [leads, searchQuery, sortOption, filterOption]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-900">Lead Tracker</h1>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          filterOption={filterOption}
          onFilterChange={setFilterOption}
        />

        {/* Leads List */}
        <div className="flex-1 overflow-hidden">
          <Sidebar
            leads={filteredLeads}
            selectedLead={selectedLead}
            onSelectLead={setSelectedLead}
          />
        </div>
      </div>

      {/* Right Panel - Chat View */}
      <div className="flex-1 flex flex-col">
        {selectedLead ? (
          <ChatPanel lead={selectedLead} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-xl">Select a lead to view conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
