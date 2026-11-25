export interface Admin {
  id: string;
  username: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  totalRooms: number;
  amenities: string[];
  images: string[];
  active: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  roomTypeId: string;
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  roomsBooked: number;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
}

export interface HotelInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  policies: string[];
  images: string[];
}

export interface DashboardStats {
  checkInsToday: number;
  checkOutsToday: number;
  upcomingBookings: number;
  totalRoomTypes: number;
  totalConfirmedRevenue: number;
}
