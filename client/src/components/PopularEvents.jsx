const PopularEvents = ({ events }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Eventos Populares</h2>
      <div className="flex flex-col space-y-2">
        {events.map((event) => (
          <div
            key={event._id}
            className="flex items-center justify-between p-2 rounded-lg bg-purple-500 text-white"
          >
            <span>{event.titles}</span>
            <span className="text-xs">
              {new Date(event.startDates).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularEvents;
