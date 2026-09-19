'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationSource {
  name: string;
  initials: string;
  avatar?: string;
}

export interface NotificationEvent {
  id: string;
  source: NotificationSource;
  title: string;
  subtitle: string;
  timestamp: string;
  unread?: boolean;
}

export interface NotificationGroup {
  id: string;
  label: string;
  items: NotificationEvent[];
}

export interface NotificationDropdownProps {
  title?: string;
  countLabel?: string;
  groups?: NotificationGroup[];
  onDismiss?: () => void;
  className?: string;
  onNavigateToTab?: (tab: string) => void;
}

const defaultGroups: NotificationGroup[] = [
  {
    id: 'morning',
    label: 'Morning',
    items: [
      {
        id: 'launch-checklist',
        source: {
          name: 'Demand Radar',
          initials: 'DR',
        },
        title: 'New High Demand Event Detected',
        subtitle: 'Diwali sales surge starting soon',
        timestamp: '12m ago',
        unread: true,
      },
      {
        id: 'priority-review',
        source: {
          name: 'Inventory',
          initials: 'INV',
        },
        title: 'Inventory Alert',
        subtitle: 'Gift boxes are running low',
        timestamp: '24m ago',
        unread: true,
      },
    ],
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    items: [
      {
        id: 'revenue-notes',
        source: {
          name: 'Sales',
          initials: 'S',
        },
        title: 'Daily sales target reached!',
        subtitle: 'You crossed ₹1,25,000 today',
        timestamp: '1h ago',
        unread: true,
      },
    ],
  },
];

export function NotificationDropdown({
  title = 'Notifications',
  countLabel,
  groups = defaultGroups,
  onDismiss,
  className,
  onNavigateToTab
}: NotificationDropdownProps) {
  const unreadCount = groups.reduce(
    (total, group) => total + group.items.filter((item) => item.unread).length,
    0,
  );

  return (
    <section
      className={cn(
        'bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-2xl rounded-3xl pb-2 ring-0',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <h2 className="text-gray-900 text-sm font-bold tracking-tight">
            {title}
          </h2>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums">
            {countLabel ?? `${unreadCount} New`}
          </span>
        </div>

        <button
          className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-all"
          aria-label="Close notifications"
          onClick={onDismiss}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1 px-2 pt-2 max-h-[350px] overflow-y-auto no-scrollbar">
        {groups.map((group) => (
          <NotificationGroupCard key={group.id} group={group} onNavigateToTab={onNavigateToTab} />
        ))}
      </div>
    </section>
  );
}

function NotificationGroupCard({ group, onNavigateToTab }: { group: NotificationGroup; onNavigateToTab?: (tab: string) => void }) {
  return (
    <section className="overflow-hidden rounded-2xl mb-1">
      <div className="px-3 pt-2 pb-1">
        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
          {group.label}
        </p>
      </div>

      <div className="px-2 pt-1 pb-2">
        {group.items.map((event) => (
          <React.Fragment key={event.id}>
            <NotificationEventRow event={event} onNavigateToTab={onNavigateToTab} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function NotificationEventRow({ event, onNavigateToTab }: { event: NotificationEvent; onNavigateToTab?: (tab: string) => void }) {
  const handleClick = () => {
    if (!onNavigateToTab) return;
    if (event.source.name === 'Demand Radar') {
      onNavigateToTab('festivals');
    } else {
      onNavigateToTab('ledger');
    }
  };

  return (
    <article 
      onClick={handleClick}
      className="group hover:bg-blue-50/50 cursor-pointer flex items-center gap-3 rounded-xl px-2 py-2 transition-colors"
    >
      <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
        {event.source.avatar ? (
          <img src={event.source.avatar} alt={event.source.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-blue-700 text-xs font-bold">
            {event.source.initials}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-gray-900 truncate text-[13px] font-semibold leading-tight">
          {event.title}
        </h3>
        <p className="text-gray-500 mt-0.5 truncate text-[11px]">
          {event.subtitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        <span className="text-gray-400 text-[10px] font-medium">{event.timestamp}</span>
      </div>
    </article>
  );
}
