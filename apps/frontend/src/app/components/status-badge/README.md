# Status Badge Component

A simple status badge component that displays task processing statuses.

## Features

- **Three Status Types**: Processed, Failed, Pending
- **Semantic Colors**: Green for processed, red for failed, yellow for pending
- **Clean Design**: Simple, focused component for status display
- **Modern Angular**: Uses standalone components and signals

## Usage

```html
<!-- Processed status -->
<app-status-badge status="Processed"></app-status-badge>

<!-- Failed status -->
<app-status-badge status="Failed"></app-status-badge>

<!-- Pending status -->
<app-status-badge status="Pending"></app-status-badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `BadgeStatus` | `'Pending'` | The status to display |

## Types

```typescript
type BadgeStatus = 'Processed' | 'Failed' | 'Pending';
```

## Styling

The component uses semantic colors:
- **Processed**: Green (#10b981) - indicates successful completion
- **Failed**: Red (#ef4444) - indicates error or failure
- **Pending**: Yellow (#f59e0b) - indicates waiting or in progress

## Examples

See the demo section in the main app for live examples of all three status badges.
