import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axiosClient from '../utils/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch internship deadlines
        const internshipsResponse = await axiosClient.get('/api/internships', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        

        //Fetch user application events
        // const applicationsResponse = await axiosClient.get('/api/applications', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });

        console.log(internshipsResponse);
        
        // Combine and format events for the calendar
        const deadlineEvents = internshipsResponse.data.map(item => ({          
          id: `deadline-${item._id}`,
          title: `Deadline: ${item.role} at ${item.companyName}`,
          start: item.deadline,
          end: item.deadline,
          allDay: true,
          backgroundColor: '#4c1d95', // primary-900
          borderColor: '#4c1d95',
          textColor: '#ffffff',
          extendedProps: {
            type: 'deadline',
            internshipId: item.id
          }
        }));
        
        // const applicationEvents = applicationsResponse.data.map(item => ({
        //   id: `application-${item.id}`,
        //   title: `${item.eventType}: ${item.internshipRole}`,
        //   start: item.eventDate,
        //   end: item.eventDate,
        //   allDay: item.allDay,
        //   backgroundColor: item.eventType === 'Interview' ? '#6d28d9' : '#8b5cf6', // primary colors
        //   borderColor: item.eventType === 'Interview' ? '#6d28d9' : '#8b5cf6',
        //   textColor: '#ffffff',
        //   extendedProps: {
        //     type: 'application',
        //     applicationId: item.id,
        //     description: item.description
        //   }
        // }));
        console.log(deadlineEvents);
        
        
        // setEvents([...deadlineEvents, ...applicationEvents]);
        setEvents(prev => {
          const newEvents = [...prev, ...deadlineEvents];
          console.log('Setting events:', newEvents);
          return newEvents;
        });
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        toast.error('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const eventType = event.extendedProps.type;
    
    if (eventType === 'deadline') {
      // Navigate to internship details
      // window.location.href = `/internships/${event.extendedProps.internshipId}`;
      
      toast.info(`Deadline for ${event.title} is on ${event.start}`);
    } else if (eventType === 'application') {
      // Show application details
      toast.info(event.extendedProps.description || event.title);
    }
  };

  return (
    <div className="min-h-screen bg-dark-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Application Calendar</h1>
          <div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="bg-dark-700 rounded-xl p-6 shadow-card">
            <div className={`calendar-container`} >
             
              
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                dayMaxEvents={3}
              />
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block rounded-full bg-primary-900 mr-2"></span>
                <span className="text-sm text-gray-300">Application Deadlines</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block rounded-full bg-primary-700 mr-2"></span>
                <span className="text-sm text-gray-300">Interviews</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 inline-block rounded-full bg-primary-500 mr-2"></span>
                <span className="text-sm text-gray-300">Other Events</span>
              </div>
            </div>
          </div>
        )}
        
        {!loading && events.length === 0 && (
          <div className="mt-8 bg-dark-700 rounded-xl p-8 text-center shadow-card">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-medium text-white mb-2">No events yet</h2>
            <p className="text-gray-400 mb-6">You don't have any upcoming deadlines or events.</p>
            <button className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Add Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;