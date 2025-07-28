export function Footer() {
    return (
      <footer className="w-full py-8 bg-background border-t text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} TEKs. All rights reserved.
        </div>
      </footer>
    );
  }