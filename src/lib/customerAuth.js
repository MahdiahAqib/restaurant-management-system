import cookie from "cookie";

export function requireCustomerAuth(getServerSidePropsFunc = null) {
  return async (context) => {
    const { req } = context;

    // Parse cookies from request headers
    const cookies = cookie.parse(req.headers.cookie || "");
    const userCookie = cookies.user;

    if (!userCookie) {
      // Redirect if no user cookie is found
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    try {
      // Parse the user data from the cookie
      const user = JSON.parse(userCookie);

      // Perform custom validation if needed (e.g., role check, expiry validation)
      if (!user || !user.id || user.role.toLowerCase() !== "user") {
        console.log("User validation failed. Redirecting to login.");
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      if (getServerSidePropsFunc) {
        // Call the wrapped getServerSideProps function and pass additional props
        const props = await getServerSidePropsFunc(context);
        return {
          props: {
            user, // Pass validated user data
            ...props.props,
          },
        };
      }

      // Return user data as props
      return {
        props: { user },
      };
    } catch (error) {
      console.error("Error parsing or validating user cookie:", error);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
}
