'use client';

import React, { useState, useMemo } from 'react';
import { useRobot } from '@/lib/robot-context';
import { Delivery, DeliveryStatus } from '@/types/delivery';
import { HospitalLocation } from '@/types/robot';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { DeliveryDetailModal } from './DeliveryDetailModal';
import { NewDeliveryModal } from './NewDeliveryModal';

export function DeliveryTable() {
  const { deliveries } = useRobot();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [destinationFilter, setDestinationFilter] = useState<string>('ALL');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(del => {
      const matchesSearch =
        del.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        del.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        del.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        del.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        del.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || del.status === statusFilter;

      const matchesDest =
        destinationFilter === 'ALL' || del.destination === destinationFilter;

      return matchesSearch && matchesStatus && matchesDest;
    });
  }, [deliveries, searchQuery, statusFilter, destinationFilter]);

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="emerald" size="sm" dot>Delivered</Badge>;
      case 'In Progress':
        return <Badge variant="cyan" size="sm" dot>In Progress</Badge>;
      case 'Pending':
        return <Badge variant="amber" size="sm" dot>Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="crimson" size="sm" dot>Cancelled</Badge>;
    }
  };

  const getPriorityBadge = (priority: Delivery['priority']) => {
    switch (priority) {
      case 'Stat (Emergency)':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">STAT</span>;
      case 'Urgent':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">URGENT</span>;
      default:
        return <span className="text-[10px] font-mono text-slate-500">ROUTINE</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by ID, medicine, patient, or ward..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">Status: All</option>
            <option value="In Progress">In Progress</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Destination Filter */}
          <select
            value={destinationFilter}
            onChange={e => setDestinationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">Destination: All</option>
            <option value="Room 101">Room 101</option>
            <option value="Room 102">Room 102</option>
            <option value="Room 103">Room 103</option>
            <option value="ICU">ICU</option>
            <option value="Emergency Ward">Emergency Ward</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Operation Theatre">Operation Theatre</option>
          </select>

          {/* New Delivery Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            className="text-xs h-9 font-semibold"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Delivery
          </Button>
        </div>
      </div>

      {/* Responsive Deliveries Table / Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Delivery ID</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Medicine & Patient</th>
                <th className="py-3.5 px-4">Requested By</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Robot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No medicine deliveries found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map(del => (
                  <tr
                    key={del.id}
                    onClick={() => setSelectedDelivery(del)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Delivery ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      <div className="flex items-center gap-1.5">
                        <span>{del.id}</span>
                        {getPriorityBadge(del.priority)}
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{del.destination}</span>
                      <span className="text-[10px] text-slate-400 font-mono">From: {del.origin}</span>
                    </td>

                    {/* Medicine */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-medium text-slate-200 block truncate">{del.medicine}</span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        For: <strong className="text-slate-300">{del.patientName}</strong> ({del.patientBed})
                      </span>
                    </td>

                    {/* Requested By */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="block font-medium">{del.requestedBy}</span>
                      <span className="text-[10px] text-slate-500">{del.requestedRole}</span>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {del.time}
                    </td>

                    {/* Robot */}
                    <td className="py-3.5 px-4 font-mono text-sky-300 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        <span>{del.robotId}</span>
                        <span className="text-[10px] text-slate-500 ml-1">Bay {del.compartment}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(del.status)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedDelivery(del);
                        }}
                        className="text-xs h-7 px-2 text-slate-400 hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Count */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>
            Showing <strong className="text-slate-200">{filteredDeliveries.length}</strong> of{' '}
            <strong className="text-slate-200">{deliveries.length}</strong> medicine dispatch records
          </span>
          <span className="text-slate-500">Autonomous Carrier SMR-01 Log</span>
        </div>
      </div>

      {/* Modals */}
      {selectedDelivery && (
        <DeliveryDetailModal
          isOpen={!!selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          delivery={selectedDelivery}
        />
      )}

      <NewDeliveryModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
    </div>
  );
}
