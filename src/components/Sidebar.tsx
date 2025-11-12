import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import type { LeadTracker } from '../types';

interface SidebarProps {
  leads: LeadTracker[];
  selectedLead: LeadTracker | null;
  onSelectLead: (lead: LeadTracker) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  leads,
  selectedLead,
  onSelectLead,
}) => {
  return (
    <div className="h-full overflow-y-auto">
      {leads.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No leads found
        </div>
      ) : (
        leads.map((lead) => {
          const isSelected = selectedLead?.id === lead.id;
          const lastMessageDate = lead.recent_timestamp
            ? format(new Date(lead.recent_timestamp), 'yyyy-MM-dd')
            : 'N/A';
          const timeSince = lead.recent_timestamp
            ? formatDistanceToNow(new Date(lead.recent_timestamp), {
                addSuffix: true,
              })
            : 'N/A';

          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate capitalize">
                    {lead.username}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Last message: {lastMessageDate}
                  </p>
                  <p className="text-xs text-gray-500">{timeSince}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Last sender: {lead.latest_sender}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        lead.action_item === 'Follow up'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {lead.action_item}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
