'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

export const MONTHS: readonly string[] = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

/** Returns a tight window of 5 years centred on the given year. */
export function getYearRange(centreYear: number): number[] {
  return [
    centreYear - 2,
    centreYear - 1,
    centreYear,
    centreYear + 1,
    centreYear + 2,
  ];
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CalendarHeaderProps {
  /** Zero-based month index (0 = January … 11 = December). */
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  /** Called after the internal state updates; receives the new month+year. */
  onPrev?: (month: number, year: number) => void;
  onNext?: (month: number, year: number) => void;
  className?: string;
}

// ─────────────────────────────────────────────
// Sub-component: CustomSelect
// ─────────────────────────────────────────────

interface Option {
  value: number;
  label: string;
}

interface CustomSelectProps {
  id: string;
  value: number;
  options: Option[];
  onChange: (value: number) => void;
  width?: number | string;
  ariaLabel?: string;
}

function CustomSelect({ id, value, options, onChange, width = 'auto', ariaLabel }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width,
      }}
    >
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '38px',
          padding: '0 12px',
          border: isOpen ? '1px solid #0E3B66' : '1px solid #E2E8F0',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          color: '#0E3B66',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(14, 59, 102, 0.15)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : ''}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: '#6B7280',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginLeft: '6px',
            flexShrink: 0,
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 50,
              width: '100%',
              minWidth: typeof width === 'number' && width < 120 ? '100px' : '100%',
              marginTop: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
              padding: '6px',
              maxHeight: '220px',
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#0E3B66' : '#334155',
                    backgroundColor: isSelected ? '#F1F5F9' : 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.color = '#0E3B66';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#334155';
                    }
                  }}
                >
                  {opt.label}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-component: nav button (prev / next)
// ─────────────────────────────────────────────

interface NavButtonProps {
  onClick: () => void;
  disabled?: boolean;
  'aria-label': string;
  children: React.ReactNode;
}

function NavButton({ onClick, disabled = false, children, ...ariaProps }: NavButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...ariaProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: 10,
        border: '1px solid #E2E8F0',
        backgroundColor: pressed ? '#F1F5F9' : hovered ? '#F8FAFC' : '#ffffff',
        color: disabled ? '#D1D5DB' : '#0E3B66',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s ease',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        outline: 'none',
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// Main component: CalendarHeader
// ─────────────────────────────────────────────

export default function CalendarHeader({
  month,
  year,
  onMonthChange,
  onYearChange,
  onPrev,
  onNext,
  className = '',
}: CalendarHeaderProps) {
  const years = getYearRange(year);

  // ── Navigation handlers ──────────────────────

  const previousMonth = useCallback(() => {
    if (month === 0) {
      onMonthChange(11);
      onYearChange(year - 1);
      onPrev?.(11, year - 1);
    } else {
      onMonthChange(month - 1);
      onPrev?.(month - 1, year);
    }
  }, [month, year, onMonthChange, onYearChange, onPrev]);

  const nextMonth = useCallback(() => {
    if (month === 11) {
      onMonthChange(0);
      onYearChange(year + 1);
      onNext?.(0, year + 1);
    } else {
      onMonthChange(month + 1);
      onNext?.(month + 1, year);
    }
  }, [month, year, onMonthChange, onYearChange, onNext]);

  const monthOptions = MONTHS.map((name, idx) => ({ value: idx, label: name }));
  const yearOptions = years.map((y) => ({ value: y, label: String(y) }));

  // ── Render ───────────────────────────────────

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        boxSizing: 'border-box',
      }}
      role="group"
      aria-label="Navigasi kalender"
    >
      {/* ── Previous button ─────────────────── */}
      <NavButton onClick={previousMonth} aria-label="Bulan sebelumnya">
        <ChevronLeft size={16} strokeWidth={2.4} />
      </NavButton>

      {/* Month dropdown */}
      <CustomSelect
        id="calendar-month-select"
        value={month}
        options={monthOptions}
        onChange={onMonthChange}
        ariaLabel="Pilih bulan"
        width={140}
      />

      {/* Year dropdown */}
      <CustomSelect
        id="calendar-year-select"
        value={year}
        options={yearOptions}
        onChange={onYearChange}
        ariaLabel="Pilih tahun"
        width={80}
      />

      {/* ── Next button ─────────────────────── */}
      <NavButton onClick={nextMonth} aria-label="Bulan berikutnya">
        <ChevronRight size={16} strokeWidth={2.4} />
      </NavButton>
    </div>
  );
}

