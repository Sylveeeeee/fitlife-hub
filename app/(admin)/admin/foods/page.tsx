import FoodForm from "../../foodsform/form";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen text-black p-6 font-mono ">
      <h1 className="text-3xl font-semibold">Admin Food Dashboard</h1>
      <FoodForm />
    </div>
  );
}
