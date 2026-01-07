// UI Component Library - Centralized Exports
// Import components from here for easier usage:
// import { Button, Input, Card, Modal, Badge } from '@/components';

// Core Form Components
export { default as Button } from './Button';
export type { ButtonVariant, ButtonSize } from './Button';

export { default as Input } from './Input';
export type { InputSize } from './Input';

export { default as Textarea } from './Textarea';
export type { TextareaSize } from './Textarea';

export { default as Select } from './Select';
export type { SelectSize, SelectOption } from './Select';

export { FormGroup, FormRow, FormActions } from './FormGroup';

// Display Components
export { default as Card, CardHeader, CardBody, CardFooter, CardTitle } from './Card';
export type { CardVariant } from './Card';

export { default as Badge } from './Badge';
export type { BadgeVariant, BadgeSize } from './Badge';

export { default as Avatar } from './Avatar';
export type { AvatarSize } from './Avatar';

export { default as StatCard } from './StatCard';
export type { StatCardVariant } from './StatCard';

export { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from './Table';

// Feedback Components
export { default as Alert } from './Alert';
export type { AlertVariant } from './Alert';

export { default as Modal } from './Modal';

export { LoadingSpinner } from './LoadingSpinner';

export { default as EmptyState } from './EmptyState';

// Navigation & Layout
export { default as PageHeader } from './PageHeader';

export { default as Divider } from './Divider';

export { default as IconButton } from './IconButton';
export type { IconButtonVariant, IconButtonSize } from './IconButton';

export { default as Link } from './Link';
export type { LinkVariant } from './Link';

// Existing Components (re-export)
export { StatusBadge } from './StatusBadge';
export { StarRating } from './StarRating';
export { default as Layout } from './Layout/Layout';
export { default as Navbar } from './Navbar/Navbar';
export { default as CookieConsent } from './CookieConsent/CookieConsent';
