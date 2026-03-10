import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Filter, Loader } from "lucide-react";
import { type IEEEEventResponse } from "./iEEEType";
import EventCard from "./eventCard";
import { Button, Input, Select } from "../../components/ui/components";
import usePaginatedFetch from "../../utils/hooks/usePaginated";
import { iEEEApi } from "../../utils/APIs/IEEEApi";
import InfiniteList from "../../components/InfiniteList";

export default function EventsPage() {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [cancelled, setCancelled] = useState("all");
  const [cost, setCost] = useState("all");
  const [city, setCity] = useState("");
  const [startTimeAfter, setStartTimeAfter] = useState("");
  const [startTimeBefore, setStartTimeBefore] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

  const {
    items: events,
    loading,
    targetRef: eventsRef
  } = usePaginatedFetch<IEEEEventResponse>({
    fetchFn: ({ page, search }) =>
      iEEEApi.getEvents({
        limit: 100,
        published: "true",
        page,
        search,
        location_type: locationFilter !== "all" ? locationFilter : undefined,
        cancelled: cancelled !== "all" ? cancelled === "true" : undefined,
        cost: cost !== "all" ? cost === "true" : undefined,
        city: city || undefined,
        start_time_after: startTimeAfter || undefined,
        start_time_before: startTimeBefore || undefined,
      }),
    totalAmountKey: "total_amount",
    objectKey: "events",
    search: searchQuery,
    enabled: true,
    startPage: 1,
  });

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const query = searchQuery.toLowerCase();
    return events.filter((event) => {
      const attrs = event.attributes;
      return (
        attrs.title.toLowerCase().includes(query) ||
        attrs.description.toLowerCase().includes(query) ||
        attrs.keywords.toLowerCase().includes(query)
      );
    });
  }, [events, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setCancelled("all");
    setCost("all");
    setCity("");
    setStartTimeAfter("");
    setStartTimeBefore("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Header */}
      <motion.div
        className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800 py-8 md:py-12 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto">
          <h1
            className="text-4xl md:text-6xl font-black mb-2"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: "linear-gradient(135deg, #862633, #FAAE1F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "2px",
            }}
          >
            IEEE EVENTS
          </h1>
          <p className="text-gray-400 text-lg">Discover upcoming events from IEEE Robotics and Automation Society</p>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        className="mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search events by title or keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-gray-400 mt-2" />
            <Select
              options={[
                { value: "all", label: "All Locations" },
                { value: "virtual", label: "Virtual" },
                { value: "physical", label: "Physical" },
                { value: "hybrid", label: "Hybrid" },
              ]}
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">City</label>
            <Input
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <Select
              options={[
                { value: "all", label: "All" },
                { value: "false", label: "Active" },
                { value: "true", label: "Cancelled" },
              ]}
              value={cancelled}
              onChange={(e) => {
                setCancelled(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Cost</label>
            <Select
              options={[
                { value: "all", label: "All" },
                { value: "true", label: "Paid" },
                { value: "false", label: "Free" },
              ]}
              value={cost}
              onChange={(e) => {
                setCost(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex gap-2 items-end">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Start Date (From)</label>
            <Input
              type="date"
              value={startTimeAfter}
              onChange={(e) => {
                setStartTimeAfter(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Start Date (To)</label>
            <Input
              type="date"
              value={startTimeBefore}
              onChange={(e) => {
                setStartTimeBefore(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="max-w-7xl mx-auto px-4 py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader className="w-8 h-8 text-blue-500 mx-auto animate-spin mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </motion.div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <>
          <motion.div
            className="mx-auto px-4 pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No events found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfiniteList
                  items={filteredEvents}
                  renderItem={(event, idx) => <EventCard key={event.id} event={event} index={idx} />}
                  loading={loading}
                  sentinelRef={eventsRef}
                  emptyText="No events match your search."
                />
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="max-w-7xl mx-auto px-4 pb-16 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}