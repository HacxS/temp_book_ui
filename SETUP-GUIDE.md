# Setup Guide

## Quick Start

This Angular project has been set up with the latest version (21.0.4) and SCSS styling.

### 1. Navigate to the project

```bash
cd book_entry
```

### 2. Start the development server

```bash
npm start
```

Or alternatively:

```bash
ng serve
```

The app will be available at: `http://localhost:4200/`

### 3. Start developing!

The project structure is clean and ready for development.

## SCSS Integration

SCSS is fully integrated and configured. You can use SCSS features like:

### Variables

```scss
// In your .scss files
$primary-color: #007bff;
$secondary-color: #6c757d;

.button {
  background-color: $primary-color;
}
```

### Nesting

```scss
.container {
  padding: 20px;
  
  .header {
    font-size: 24px;
    
    &:hover {
      color: blue;
    }
  }
}
```

### Mixins

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  @include flex-center;
}
```

## File Locations

- **Global Styles**: `src/styles.scss` - Add your global CSS variables, resets, and utilities here
- **Component Styles**: `src/app/app.scss` - Component-specific styles with SCSS nesting
- **Component Template**: `src/app/app.html` - HTML template
- **Component Logic**: `src/app/app.ts` - TypeScript component class

## Creating New Components

When creating new components, they will automatically use SCSS:

```bash
ng generate component my-component
# or shorthand:
ng g c my-component
```

This will create:
- `my-component.ts`
- `my-component.html`
- `my-component.scss` ✅ (SCSS by default)
- `my-component.spec.ts`

## Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `ng g c <name>` | Generate component |
| `ng g s <name>` | Generate service |
| `ng g m <name>` | Generate module |

## Project Configuration

The project is configured with:

- ✅ **Style preprocessor**: SCSS (configured in `angular.json`)
- ✅ **Routing**: Enabled (`app.routes.ts`)
- ✅ **Standalone components**: Modern Angular approach
- ✅ **TypeScript**: Latest configuration

## Next Steps

1. **Add components**: Create your UI components in `src/app/`
2. **Add routing**: Configure routes in `src/app/app.routes.ts`
3. **Add services**: Create services for business logic
4. **Style globally**: Update `src/styles.scss` for global styles
5. **Add assets**: Place images, fonts, etc. in `public/` folder

## Tips

- Use SCSS variables for consistent theming
- Keep component styles scoped to components
- Use global styles sparingly
- Leverage Angular's built-in styling features like `:host`, `::ng-deep`, etc.

Happy coding! 🚀

