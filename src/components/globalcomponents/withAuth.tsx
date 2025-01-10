import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd/lib";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthHOC = (props: any) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        signIn();
      }
    }, [status]);

    if (status === "loading" || !session) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Spin />
        </div>
      ); // or any loading spinner
    }

    if (status === "authenticated") {
      return <WrappedComponent {...props} />;
    }
  };

  // Set the display name for the higher-order component
  AuthHOC.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthHOC;
};

export default withAuth;
