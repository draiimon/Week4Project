import * as schema from "@shared/schema";

// Check if we're using AWS mode
const useAwsDb = process.env.USE_AWS_DB === 'true';

// Create dummy db object for DynamoDB mode
// This is to maintain compatibility with the existing code
export const pool = null;

// Create a minimal db object that mimics the interface expected by other parts of the code
export const db = {
  select: () => ({ 
    from: () => ({ 
      where: () => [] 
    }) 
  }),
  insert: () => ({ 
    values: () => ({ 
      returning: () => [] 
    }) 
  })
};
