import { money, dateTime } from '../api.js';

export default function SalesTable({ sales }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Date</th></tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s._id}>
              <td>{s.invoiceNo}</td>
              <td>{s.customerName}</td>
              <td>{money(s.total)}</td>
              <td>{dateTime(s.createdAt)}</td>
            </tr>
          ))}
          {sales.length === 0 && <tr><td colSpan="4" className="empty">No sales recorded yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
