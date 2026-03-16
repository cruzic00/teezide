import Link from "next/link";
import { Users, ShoppingBag, Package, TrendingUp, DollarSign, Activity, FileText } from "lucide-react";
import clientPromise from "../../lib/mongodb";

export default async function AdminDashboard() {
  const client = await clientPromise;
  const db = client.db("tee_store");

  // Fetch real stats
  const userCount = await db.collection("users").countDocuments();
  const orderCount = await db.collection("orders").countDocuments();
  const productCount = await db.collection("products").countDocuments();

  // Calculate revenue (mock for now unless order structure is known)
  // Assuming orders have a 'total' field. If not, it's 0.
  const revenueResult = await db.collection("orders").aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]).toArray();
  const totalRevenue = revenueResult[0]?.total || 0;

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${(totalRevenue / 100).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      change: "+12.5%",
      trend: "up"
    },
    {
      title: "Active Users",
      value: userCount,
      icon: Users,
      color: "bg-blue-500",
      change: "+5.2%",
      trend: "up"
    },
    {
      title: "Total Orders",
      value: orderCount,
      icon: ShoppingBag,
      color: "bg-purple-500",
      change: "+2.1%",
      trend: "up"
    },
    {
      title: "Products",
      value: productCount,
      icon: Package,
      color: "bg-orange-500",
      change: "0%",
      trend: "neutral"
    },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-semibold hover:bg-neutral-50 transition">
            Download Report
          </button>
          <Link href="/products/new" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition shadow-lg shadow-neutral-900/20">
            + Add Product
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split("-")[1]}-600`}>
                <stat.icon size={24} className={stat.color.replace("bg-", "text-")} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-neutral-500 text-sm font-semibold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* TWO COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity (Mock) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-yellow-500" />
              Recent Activity
            </h3>
            <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>

          <div className="space-y-6">
            {/* Empty state or simple list */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-neutral-50 pb-4 last:border-0 last:pb-0 relative">
                <div className="w-2 h-2 rounded-full bg-blue-500 absolute -left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100"></div>
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">
                  #{1000 + i}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-neutral-900">New Order Placed</p>
                  <p className="text-xs text-neutral-500">2 minutes ago</p>
                </div>
                <div className="font-bold text-neutral-900">₹1,499</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Status */}
        <div className="bg-neutral-900 text-white rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>

          <h3 className="text-xl font-bold mb-4 relative z-10">System Status</h3>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Database</span>
              <span className="text-green-400 font-bold flex items-center gap-1">● Online</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Server</span>
              <span className="text-green-400 font-bold flex items-center gap-1">● Healthy</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-400">Last Backup</span>
              <span className="text-white font-medium">2 hours ago</span>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/admin/settings" className="block w-full text-center py-3 bg-white text-black font-bold rounded-xl hover:bg-yellow-400 transition transform active:scale-95">
              System Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
