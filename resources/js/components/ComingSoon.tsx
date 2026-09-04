import { ReactNode } from "react";
import { AdminLayout } from "./AdminLayout";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export const ComingSoon = ({ title, description, icon }: ComingSoonProps) => {
  return (
    <AdminLayout title={title}>
      <div className="p-6 lg:p-10 animate-fade-in">
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Module</p>
          <h2 className="font-display text-4xl font-medium text-leaf">{title}</h2>
          <p className="mt-2 text-earth/60 max-w-2xl">{description}</p>
        </header>

        <section className="rounded-3xl bg-white border border-straw shadow-card p-10 md:p-16 text-center">
          <div className="size-16 mx-auto rounded-2xl bg-straw flex items-center justify-center text-leaf mb-5">
            {icon}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">
            Coming Soon
          </p>
          <h3 className="font-display text-2xl font-medium text-leaf">
            This module is being prepared.
          </h3>
          <p className="text-earth/60 mt-2 max-w-md mx-auto">
            Records and forms for {title.toLowerCase()} will appear here once the backend is connected.
          </p>
        </section>
      </div>
    </AdminLayout>
  );
};
