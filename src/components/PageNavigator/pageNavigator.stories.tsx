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
