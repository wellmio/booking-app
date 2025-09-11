# Research & Discovery

## Calendar Component

*   **Decision**: Use `shadcn/ui` for the calendar component.
*   **Rationale**: It is a popular, well-maintained library that integrates seamlessly with React, Next.js, and Tailwind CSS. It allows for adding individual components, which keeps the bundle size small. The calendar component is built on `react-day-picker`, which is a robust and accessible library for building date-related components.
*   **Alternatives considered**:
    *   **Flowbite React**: Another good option, but `shadcn/ui` seems to have more momentum in the community.
    *   **Building from scratch**: This would give us more control but would also be more time-consuming and prone to errors. Given the availability of high-quality libraries, this is not necessary.

## Stripe Integration

*   **Decision**: Use Stripe Checkout for the payment flow.
*   **Rationale**: Stripe Checkout provides a pre-built, secure, and customizable payment page. This reduces our PCI compliance burden and saves development time. The payment flow will be initiated from the client-side, but the Checkout Session will be created on the server-side (in a Next.js API route) to ensure security. Webhooks will be used to handle post-payment events, such as updating the booking status in the database.
*   **Alternatives considered**:
    *   **Stripe Elements**: This would give us a more custom checkout experience, but it would also require more work to implement and maintain. For the initial implementation, Stripe Checkout is sufficient.
