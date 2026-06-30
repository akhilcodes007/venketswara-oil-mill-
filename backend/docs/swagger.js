import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sri Venkateshwara Oil Mill — API Documentation',
      version: '1.0.0',
      description:
        'Production-ready REST API for Sri Venkateshwara Oil Mill eCommerce platform. ' +
        'Supports auth (Supabase OTP), products, orders, payments (Razorpay), ' +
        'PDF invoices, admin dashboard and real-time Socket.io notifications.',
      contact: { name: 'SVEM Support', email: 'support@svem.com' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://svem-backend.onrender.com', description: 'Production (Render)' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Supabase access token. Obtain via supabase.auth.getSession() on the frontend.',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  // Scan all route and controller files for @swagger JSDoc annotations
  apis: ['./routes/*.js', './controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
