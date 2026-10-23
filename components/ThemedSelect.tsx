'use client';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

export default function ThemedSelect({label, value, onValueChange, options}: {label: string; value: string; onValueChange: (value: string) => void; options: {value: string; label: string}[]}) {
  return <Select items={options} value={value} onValueChange={next => {if (next !== null) onValueChange(next);}}>
    <SelectTrigger aria-label={label} className="w-full">
      <SelectValue>{selected => options.find(option => option.value === selected)?.label || 'Choisir…'}</SelectValue>
    </SelectTrigger>
    <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6} className="p-1">
      {options.map(option => <SelectItem key={option.value} value={option.value} className="min-h-8 px-2 pr-8">{option.label}</SelectItem>)}
    </SelectContent>
  </Select>;
}
