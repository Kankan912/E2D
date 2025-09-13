import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary'
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  onClick,
  color = 'primary'
}: DashboardCardProps) {
  const colorClasses = {
    primary: {
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
    },
    success: {
      icon: 'text-success-600',
      iconBg: 'bg-success-100',
    },
    warning: {
      icon: 'text-warning-600',
      iconBg: 'bg-warning-100',
    },
    danger: {
      icon: 'text-danger-600',
      iconBg: 'bg-danger-100',
    },
    secondary: {
      icon: 'text-secondary-600',
      iconBg: 'bg-secondary-100',
    }
  }

  const colors = colorClasses[color]

  return (
    <div
      className={`card ${onClick ? 'card-interactive' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">
              {value}
            </p>
            
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            
            {trend && (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  trend.isPositive 
                    ? 'bg-success-100 text-success-700' 
                    : 'bg-danger-100 text-danger-700'
                }`}>
                  <span className="mr-1">
                    {trend.isPositive ? '↗' : '↘'}
                  </span>
                  {Math.abs(trend.value)}%
                </div>
                <span className="text-xs text-gray-500">vs mois dernier</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}