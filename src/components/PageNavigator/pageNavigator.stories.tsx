import { PageNavigator } from "./PageNavigator";

export const Default = () => (
  <div className="w-full">
    <PageNavigator />
  </div>
);

export const WithInitialPages = () => (
  <div className="w-full">
    <PageNavigator
      initialPages={[
        { title: "Welcome Page", id: "welcome" },
        { title: "Contact Form", id: "contact" },
        { title: "Thank You", id: "thanks" },
      ]}
    />
  </div>
);

export const WithManyPages = () => (
  <div className="w-full">
    <PageNavigator
      initialPages={[
        { title: "Introduction", id: "intro" },
        { title: "Personal Info", id: "personal" },
        { title: "Address Details", id: "address" },
        { title: "Payment Method", id: "payment" },
        { title: "Review & Submit", id: "review" },
        { title: "Confirmation", id: "confirmation" },
      ]}
    />
  </div>
);
