// lib/auth.js
import { getSession } from "next-auth/react";

export function requireAdminAuth(getServerSidePropsFunc = null) {
  return async (context) => {
    const session = await getSession(context);

    if (!session || session.user.role !== "Admin") {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      const props = await getServerSidePropsFunc(context);
      return {
        props: {
          session,
          ...props.props,
        },
      };
    }

    return {
      props: { session },
    };
  };
}
