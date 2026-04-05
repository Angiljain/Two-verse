'use client';
import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Calendar as CalendarIcon, Plus, Trash2, Heart } from 'lucide-react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, startOfDay } from 'date-fns';

interface EventType {
  _id: string;
  title: string;
  date: string;
  type: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'Date' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/events', newEvent);
      setShowModal(false);
      setNewEvent({ title: '', date: '', type: 'Date' });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Anniversary': return 'bg-pink-500 text-white';
      case 'Date': return 'bg-purple-500 text-white';
      case 'Plan': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const selectedDayEvents = selectedDate 
    ? events.filter(e => isSameDay(parseISO(e.date), selectedDate))
    : [];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><CalendarIcon className="w-8 h-8 text-primary" /> Shared Calendar</h1>
          <p className="text-white/60 mt-1">Keep track of your special moments and future dates.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6">
          <Plus className="w-4 h-4" /> <span>Add Event</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={prevMonth} className="px-4 py-2">&lt;</Button>
              <Button variant="ghost" onClick={nextMonth} className="px-4 py-2">&gt;</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-white/50 text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-2 gap-y-4">
            {/* Pad Start of month */}
            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
              <div key={`pad-${i}`} className="h-16" />
            ))}
            
            {daysInMonth.map(day => {
              const dayEvents = events.filter(e => isSameDay(parseISO(e.date), day));
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div 
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-16 sm:h-20 rounded-xl border p-1 cursor-pointer transition-colors ${isSelected ? 'border-secondary bg-secondary/20' : isToday ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:bg-white/10'} flex flex-col items-center justify-start relative overflow-hidden text-clip`}
                >
                  <span className={`text-sm font-medium ${isToday || isSelected ? 'text-primary' : ''}`}>{format(day, 'd')}</span>
                  <div className="flex flex-wrap gap-1 mt-1 justify-center max-w-full px-1">
                    {dayEvents.map(ev => (
                      <div key={ev._id} className={`w-2 h-2 rounded-full ${getTypeColor(ev.type).split(' ')[0]}`} title={ev.title} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl min-h-[300px]">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {selectedDate ? format(selectedDate, 'MMMM do') : 'Select a Day'}
            </h3>
            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/40">
                <CalendarIcon className="w-8 h-8 text-white/20 mb-2" />
                <p>Click on a date to view events.</p>
              </div>
            ) : selectedDayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/40">
                <Heart className="w-8 h-8 text-white/20 mb-2" />
                <p>No events today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map(event => (
                  <div key={event._id} className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/10">
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getTypeColor(event.type)} bg-opacity-30 mb-1 inline-block`}>{event.type}</span>
                      <h4 className="font-bold whitespace-normal">{event.title}</h4>
                    </div>
                    <button onClick={(e) => handleDelete(event._id, e)} className="text-white/40 hover:text-red-500 transition-colors p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedDate && (
              <Button 
                variant="outline" 
                className="w-full mt-4 !rounded-xl"
                onClick={() => {
                  setNewEvent({ title: '', date: format(selectedDate, 'yyyy-MM-dd'), type: 'Date' });
                  setShowModal(true);
                }}
              >
                Add Event on {format(selectedDate, 'MMM d')}
              </Button>
            )}
          </div>
          
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-xl font-bold mb-4">Upcoming</h3>
             <div className="space-y-4">
               {events.filter(e => startOfDay(parseISO(e.date)) >= startOfDay(new Date())).slice(0, 4).map(event => (
                 <div key={event._id} className="flex justify-between text-sm items-center border-b border-white/5 pb-2">
                   <div className="flex flex-col overflow-hidden pr-2">
                     <span className="font-medium truncate">{event.title}</span>
                     <span className="text-[10px] text-white/50 uppercase">{event.type}</span>
                   </div>
                   <span className="text-secondary whitespace-nowrap font-medium bg-secondary/10 px-2 py-1 rounded-md">{format(parseISO(event.date), 'MMM d')}</span>
                 </div>
               ))}
               {events.filter(e => startOfDay(parseISO(e.date)) >= startOfDay(new Date())).length === 0 && (
                 <p className="text-white/40 text-sm">No upcoming events.</p>
               )}
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-md rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Add Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <Input 
                  label="Event Title" 
                  placeholder="Dinner at Luigi's" 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  required
                />
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/80">Type</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option value="Date">Date</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Plan">Future Plan</option>
                  </select>
                </div>

                <Input 
                  label="Date" 
                  type="date" 
                  value={newEvent.date}
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  required
                />

                <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/10">
                  <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
