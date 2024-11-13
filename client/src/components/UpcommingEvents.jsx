const UpcomingEvents = ({ events }) => {
  const now = new Date();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Eventos por Finalizar</h2>
      <div className="flex flex-col space-y-2">
        {events.map((event) => {
          const endDate = new Date(event.endDates);
          const isExpired = endDate < now;
          const isAboutToExpire = endDate - now <= 3 * 24 * 60 * 60 * 1000;

          let statusColor;
          if (isExpired) {
            statusColor = "bg-red-500";
          } else if (isAboutToExpire) {
            statusColor = "bg-orange-500";
          } else {
            statusColor = "bg-green-500";
          }

          return (
            <div
              key={event._id}
              className={`flex items-center justify-between p-2 rounded-lg ${statusColor} text-white`}
            >
              <span>{event.titles}</span>
              <span className="text-xs">{endDate.toLocaleDateString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;
