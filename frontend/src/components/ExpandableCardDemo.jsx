import { useEffect, useId, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots } from "@tabler/icons-react";
import { CreateSalesDialog } from "./CreateSalesDialog";
import { EditSalesDialog } from "./EditSalesDialog";
import { CreateEventsDialog } from "./CreateEventsDialog";

import { useAuth } from "../contexts/AuthContext";
import { EditEventsDialog } from "./EditEventDialog";

export function ExpandableCardDemo({ fetchSales, fetchEvents, sales, events, isProfile }) {
  const [active, setActive] = useState(null);
  const [sale, setSale] = useState(null);
  const [event, setEvent] = useState(null);
  const listingTitle = isProfile ? 'My Listings' : 'Listings';
  const eventTitle = isProfile ? 'My Events' : 'Events';
  const id = useId();
  const ref = useRef(null);
  const { user, makeAuthenticatedRequest } = useAuth();

  const [showSalesDialog, setShowSalesDialog] = useState(false);
  const [showEventsDialog, setShowEventsDialog] = useState(false);

  const [showEventsEditDialog, setShowEventsEditDialog] = useState(false);
  const [showSalesEditDialog, setShowSalesEditDialog] = useState(false);


  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleEditDialog = (e, editSale) => {
    e.stopPropagation();
    setSale(editSale);
    setShowSalesEditDialog(true);
  };

  const handleEventEditDialog = (e, editEvent) => {
    e.stopPropagation();
    setEvent(editEvent);
    setShowEventsEditDialog(true);
  };

  const handleDeleteSale = async (e, saleId) => {
    e.stopPropagation();

    try {
      const res = await makeAuthenticatedRequest("/api/sales/deleteSale", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ saleId, user_id: user.id }),
      });

      if (!res.ok) throw new Error("Failed to delete sale");
      console.log("Sale deleted!");
      // Refresh page or state
      fetchSales();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (e, eventId) => {
    e.stopPropagation();
    try {
      const res = await makeAuthenticatedRequest(
        "/api/user-events/deleteEvent",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId, user_id: user.id }),
        },
      );

      if (!res.ok) throw new Error("Failed to delete event");
      console.log("event deleted!");
      // Refresh page or state
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const renderSales = () => {
    if (sales === undefined || sales.length == 0 || sales === null) {
      return <div>No sales created yet</div>;
    } else {
      return (
        <div className="grid grid-cols-6 w-[90vw]">
          {sales.map((sale, index) => (
            <div
              key={`${sale.title}-sales`}
              onClick={() => setActive(sale)}
              className="p-4 flex flex-col w-full  hover:bg-neutral-100  rounded-xl cursor-pointer"
            >
              <div className="flex gap-4 flex-col  w-full">
                <div>
                  <img
                    width={100}
                    height={100}
                    src={sale.image_url}
                    alt={sale.title}
                    className="h-60 w-full  rounded-lg object-cover object-top"
                  />
                </div>
                <div className="flex   flex-row justify-between ">
                  <h3 className="font-medium text-neutral-800  text-center md:text-left text-base">
                    {sale.title}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                      <IconDots className="h-5 w-5 shrink-0 text-neutral-700 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      <DropdownMenuItem
                        onClick={(e) => handleEditDialog(e, sale)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteSale(e, sale.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const renderEvents = () => {
    if (events === undefined || events.length == 0 || events === null) {
      return <div>No events created yet</div>;
    } else {
      return (
        <div className="grid grid-cols-6 w-[90vw]">
          {events.map((event, index) => (
            <div
              key={`${event.title}-events-${index}`}
              onClick={() => setActive(event)}
              className="p-4 flex flex-col w-full  hover:bg-neutral-100  rounded-xl cursor-pointer"
            >
              <div className="flex gap-4 flex-col  w-full">
                <div>
                  <img
                    width={100}
                    height={100}
                    src={
                      "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-d98e8d7/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg"
                    }
                    alt={event.title}
                    className="h-60 w-full  rounded-lg object-cover object-top"
                  />
                </div>
                <div className="flex   flex-row justify-between ">
                  <h3 className="font-medium text-neutral-800  text-center md:text-left text-base">
                    {event.title}
                  </h3>

                  <DropdownMenu>
                    <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                      <IconDots className="h-5 w-5 shrink-0 text-neutral-700 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      <DropdownMenuItem
                        onClick={(e) => handleEventEditDialog(e, event)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteEvent(e, event.event_id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const handleStatusChange = async () => {
    const payload = {
      id: active.id,
      title: active.title,
      description: active.description,
      price: Number(active.price_cents),
      category_id: Number(active.category_id),
      image_url: active.image_url,
      user_id: user.id,
      is_sold: !active.is_sold,
    };

    try {
      const res = await makeAuthenticatedRequest("/api/sales/updateSale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update sale");
      console.log("Sale updated!");
      fetchSales();
      setActive((prev) => ({
        ...prev,
        is_sold: !prev.is_sold,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Create a date and set the time
    let date = new Date();
    date = setHours(date, hours);
    date = setMinutes(date, minutes);
    date = setSeconds(date, seconds);

    // Format to 12-hour time with AM/PM
    const formattedTime = format(date, "h:mm a");
    return formattedTime;
  };

  return (
    <>
      <div className="flex w-full items-end justify-end mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex py-2 px-10 rounded-md bg-blue-800 text-white align-end"
            >
              Create
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-white border-gray-300">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSalesDialog(true);
              }}
            >
              Create Sale
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-300" />

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEventsDialog(true);
              }}
            >
              Create Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Render dialogs OUTSIDE the dropdown */}
      {showSalesDialog && (
        <CreateSalesDialog
          open={showSalesDialog}
          onOpenChange={setShowSalesDialog}
          fetchSales={fetchSales}
        />
      )}

      {showEventsDialog && (
        <CreateEventsDialog
          open={showEventsDialog}
          onOpenChange={setShowEventsDialog}
          fetchEvents={fetchEvents}
        />
      )}

      <EditSalesDialog
        fetchSales={fetchSales}
        open={showSalesEditDialog}
        onOpenChange={setShowSalesEditDialog}
        defaultValues={sale}
      />

      <EditEventsDialog
        fetchEvents={fetchEvents}
        open={showEventsEditDialog}
        onOpenChange={setShowEventsEditDialog}
        defaultValues={event}
      />

      <AnimatePresence>
        {active && typeof active === "object" && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <button
              key={`button-${active.title}-${id}`}

              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </button>
            <div
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white  sm:rounded-3xl overflow-hidden"
            >
              <div>
                <img
                  width={200}
                  height={200}
                  src={
                    active.image_url
                      ? active.image_url
                      : "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-d98e8d7/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg"
                  }
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-5">
                      <h3 className="font-medium text-neutral-700  text-base">
                        {active.title}
                      </h3>

                      {active.price_cents ? (
                        <p className="text-neutral-600  text-base">
                          ${active.price_cents}
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="mt-5">
                      {active.date ? (
                        <span className="text-neutral-600  text-base">
                          On {format(new Date(active.date), "MMMM d, yyyy")}
                        </span>
                      ) : (
                        <></>
                      )}
                      {active.start_time ? (
                        <span className="text-neutral-600  text-base">
                          &nbsp; From {formatTime(active.start_time)} -
                        </span>
                      ) : (
                        <></>
                      )}
                      {active.end_time ? (
                        <span className="text-neutral-600  text-base">
                          &nbsp; To {formatTime(active.end_time)}
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="flex flex-row gap-5">
                      {active.address ? (
                        <span className="text-neutral-600  text-base">
                          At {active.address}
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="mt-5">
                      <p className="text-neutral-600  text-base">
                        {active.description}
                      </p>
                    </div>
                  </div>

                  {active.price_cents ? (
                    <button

                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleStatusChange}
                      className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                    >
                      {active.is_sold == false ? "Mark as sold" : "Sold"}
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="pt-4 relative px-4">
                  <div

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto  [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>

      <div>
        <p className="ml-4 text-lg font-bold">{listingTitle}</p>
        <ul className="max-w-[100%] mx-auto w-full grid grid-cols-1 md:grid-cols-4 items-start gap-4">
          {renderSales()}
        </ul>
      </div>

      <div className="mt-6">
        <p className="ml-4 text-lg font-bold">{eventTitle}</p>
        <ul className="max-w-[100%] mx-auto w-full grid grid-cols-1 md:grid-cols-4 items-start gap-4">
          {renderEvents()}
        </ul>
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};

export default ExpandableCardDemo;
