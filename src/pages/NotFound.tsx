import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Oldal nem található</h2>
          <p className="text-muted-foreground">A keresett oldal nem létezik vagy áthelyezték.</p>
        </div>
        <Button asChild>
          <Link to="/">
            Vissza a főoldalra
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
