// frontend/components/RoomCard.jsx
import Link from "next/link";


export default function RoomCard({ room }) {

  const mainImage = room.images && room.images.length > 0 
  ? room.images[0] 
  : '/images/default-room.png';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-yellow-200">
      
      {/* Room Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={mainImage}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        {/* Room Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {room.type || 'Standard'}
          </span>
        </div>
      </div>

      {/* Room Details */}
      <div className="p-6">
        {/* Room Name and Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{room.type}</p>
        
        {/* Room Features - if available from backend */}
        {room.features && room.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {room.features.slice(0, 2).map((feature, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {room.features.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{room.features.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Capacity and Size - if available from backend */}
        {(room.capacity || room.size) && (
          <div className="flex items-center space-x-4 mb-4 text-xs text-gray-500">
            {room.capacity && (
              <span>{room.capacity} Guests</span>
            )}
            {room.size && (
              <span>{room.size} sq ft</span>
            )}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-gray-900 font-bold text-lg">
              LKR {room.price?.toLocaleString() || '0'}
            </span>
            <span className="text-gray-600 text-sm ml-1">/ night</span>
          </div>
          <Link href={`/rooms/${room._id}`}>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-600 transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}