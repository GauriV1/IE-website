import Link from 'next/link';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function Card({ children, href, className = '' }: CardProps) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow';
  const combinedClasses = `${baseClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return <div className={combinedClasses}>{children}</div>;
}




