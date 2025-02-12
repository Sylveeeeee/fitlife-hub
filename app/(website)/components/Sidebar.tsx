import Link from 'next/link';
import { HiOutlineBars3 } from 'react-icons/hi2';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <aside className={`bg-gray-900 text-white rounded-tr-3xl transition-all duration-300 ${isCollapsed ? 'w-[4%]' : 'w-[20%]'} min-h-screen flex flex-col items-center p-4 relative`}>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="p-3   text-white rounded-full shadow-lg flex items-center justify-center absolute top-4 right-4"
      >
        <HiOutlineBars3 className="text-2xl" />
      </button>
      
      
      {!isCollapsed && (
        <ul className="mt-12 w-full">
          <li className="mb-2 "><Link href="/admin/dashboard" className="p-2 hover:bg-gray-700 flex items-center">Dashboard <span className="ml-2"></span></Link></li>
          <li className="mb-2"><Link href="/admin/manage-foods" className="p-2 hover:bg-gray-700 flex items-center">Manage Foods <span className="ml-2"></span></Link></li>
          <li className="mb-2"><Link href="/admin/manage-user" className="p-2 hover:bg-gray-700 flex items-center">Manage Users <span className="ml-2"></span></Link></li>
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
