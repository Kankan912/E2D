import React from 'react'
import { ReactNode } from 'react'
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
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
      trend: 'text-primary-600'
    },
    success: {
      bg: 'bg-success-50',
      icon: 'text-success-600',
      iconBg: 'bg-success-100',
      trend: 'text-success-600'
    },
    warning: {
      bg: 'bg-warning-50',
      icon: 'text-warning-600',
      iconBg: 'bg-warning-100',
      trend: 'text-warning-600'
    },
    danger: {
      bg: 'bg-danger-50',
      icon: 'text-danger-600',
      iconBg: 'bg-danger-100',
      trend: 'text-danger-600'
    },
    secondary: {
      bg: 'bg-secondary-50',
      icon: 'text-secondary-600',
      iconBg: 'bg-secondary-100',
      trend: 'text-secondary-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <div
      className={`card card-interactive group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={`w-12 h-12 ${colors.iconBg} rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {value}
            </p>
            
            {description && (
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
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
      
      {/* Indicateur d'interaction */}
      {onClick && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
        </div>
      )}
    </div>
  )
}