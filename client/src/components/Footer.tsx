export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">Grandview Hotel & Spa</p>
            <p className="footer-copy">A quiet address for beautifully unhurried stays.</p>
          </div>
          <div className="footer-contact">
            <span>123 Main Street, Metropolis</span>
            <span>+1 555-123-4567</span>
            <span>info@grandviewhotel.example</span>
          </div>
        </div>
        <p className="footer-legal">&copy; {new Date().getFullYear()} Grandview Hotel. All rights reserved.</p>
      </div>
    </footer>
  );
}
