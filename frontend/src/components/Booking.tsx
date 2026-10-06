import education_city_stadium from "../assets/book/education_city_stadium.jpg"
import san_sario from "../assets/book/san_sario.webp"
import santiago from "../assets/book/santiago.jpg"
import wembley from "../assets/book/wembley.jpg"
import camp_nou from "../assets/book/camp_nou.webp"

export default function Booking({ user }: { user?: { role?: string } }) {
  if (user?.role === "admin") {
    // Admin-specific booking logic
    return <div className=""></div>
  } else if (user?.role === "user") {
    // User-specific booking logic
  } else {
    // Guest role logic
  }
}
