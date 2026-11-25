import { Link, useParams } from "react-router-dom";

export function Confirmation() {
  const { code, token } = useParams();

  return (
    <div className="container section confirmation">
      <h1>Booking Confirmed!</h1>
      <p>Thank you for booking with us. A confirmation email has been sent to you.</p>
      <p>
        Your booking reference is <strong>{code}</strong>.
      </p>
      <p>
        Save this link to view or cancel your booking at any time:
        <br />
        <Link to={`/manage-booking/${code}/${token}`}>
          {window.location.origin}/manage-booking/{code}/{token}
        </Link>
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
