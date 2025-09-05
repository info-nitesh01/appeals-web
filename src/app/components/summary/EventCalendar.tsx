"use client";

import { useState } from "react";
import { Calendar, momentLocalizer, stringOrDate, View, NavigateAction } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, RadioGroup, Radio } from "@heroui/react";
import { useGetEventsQuery, useAddEventMutation, useUpdateEventMutation, useDeleteEventMutation, MyEvent as ApiEvent } from "@/store/calendarApi";
import { CalendarEvent } from "@/types";

const localizer = momentLocalizer(moment);

const EventCalendar: React.FC = () => {
  const { data: apiEvents = [], isLoading, error } = useGetEventsQuery();
  const [addEvent] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"event" | "reminder">("event");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [allDay, setAllDay] = useState(false);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");

  const calendarEvents: CalendarEvent[] = apiEvents.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  const handleSelectSlot = (slotInfo: { start: stringOrDate; end: stringOrDate; slots: stringOrDate[] }) => {
    setSelectedEvent(null);
    setTitle("");
    setType("event");
    setStartDate(new Date(slotInfo.start as Date));
    setEndDate(new Date(slotInfo.end as Date));
    setAllDay(false);
    setShowModal(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    const apiEvent: ApiEvent = {
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    };

    setSelectedEvent(apiEvent);
    setTitle(event.title);
    setType(event.type);
    setStartDate(event.start);
    setEndDate(event.end);
    setAllDay(event.allDay || false);
    setShowModal(true);
  };

  
  const onNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    setCurrentDate(newDate);
  };

  const onView = (newView: View) => {
    setCurrentView(newView);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    const newEvent: Partial<ApiEvent> = {
      title: title.trim(),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      type,
      allDay,
    };

    try {
      if (selectedEvent) {
        await updateEvent({ id: selectedEvent.id, ...newEvent }).unwrap();
      } else {
        await addEvent(newEvent).unwrap();
      }

      setShowModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await deleteEvent(selectedEvent.id).unwrap();
        setShowModal(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = event.type === "event" ? "#2c4e6c" : "#3fc3ac";
    const style = {
      backgroundColor,
      borderRadius: "25px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      fontSize: "12px",
      display: "block",
    };
    return {
      style: style,
    };
  };

  if (isLoading) return <div className="p-6">Loading events...</div>;
  if (error) return <div className="p-6">Error loading events: {JSON.stringify(error)}</div>;

  return (
    <div className="p-6 mx-auto font-sans">
      <div className="flex gap-2 justify-end mb-3">
        <p className="w-fit rounded-xl bg-[#2c4e6c] px-2 py-1 text-xs font-medium text-white inset-ring inset-ring-gray-500/10">Event</p>
        <p className="w-fit rounded-xl bg-[#3fc3ac] px-2 py-1 text-xs font-medium text-white inset-ring inset-ring-gray-500/10">Reminder</p>
      </div>
      <Calendar localizer={localizer} events={calendarEvents} startAccessor="start" endAccessor="end" style={{ height: 500 }} onSelectEvent={handleSelectEvent} onSelectSlot={handleSelectSlot} selectable eventPropGetter={eventStyleGetter} views={["month", "week", "day", "agenda"]} view={currentView} date={currentDate} onNavigate={onNavigate} onView={onView} />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} placement="center" className="max-w-md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{selectedEvent ? "Edit Event" : "Add New Event"}</ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter event title" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <RadioGroup orientation="horizontal" value={type} onValueChange={(value) => setType(value as "event" | "reminder")}>
                    <Radio value="event">Event</Radio>
                    <Radio value="reminder">Reminder</Radio>
                  </RadioGroup>
                </div>

                <div className="mb-4">
                  <Checkbox isSelected={allDay} onValueChange={setAllDay}>
                    All day event
                  </Checkbox>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Input label="Start" type="datetime-local" value={moment(startDate).format("YYYY-MM-DDTHH:mm")} onChange={(e) => setStartDate(new Date(e.target.value))} />
                  </div>
                  <div>
                    <Input label="End" type="datetime-local" value={moment(endDate).format("YYYY-MM-DDTHH:mm")} onChange={(e) => setEndDate(new Date(e.target.value))} />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between">
                {selectedEvent && (
                  <Button color="danger" variant="flat" onPress={handleDelete}>
                    Delete
                  </Button>
                )}
                <div className="ml-auto flex gap-2">
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSave} isDisabled={!title.trim()}>
                    Save
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EventCalendar;
