/**
 * Error Translator Utility
 * Translates technical error messages into more intuitive, human-readable explanations
 */

export interface ErrorTranslation {
  originalError: string;
  friendlyMessage: string;
  possibleSolutions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  documentationLinks?: string[];
}

// Database of common errors and their translations
const errorPatterns: Array<{
  pattern: RegExp;
  translation: (matches: RegExpMatchArray) => ErrorTranslation;
}> = [
  // Database connection errors
  {
    pattern: /getaddrinfo\s+ENOTFOUND\s+(.+)/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: `Cannot find the database host "${matches[1]}". The database server might be down or the connection string might be incorrect.`,
      possibleSolutions: [
        'Check if the database server is running',
        'Verify the database connection string',
        'Make sure your network can reach the database server',
        'Check for typos in the host name'
      ],
      severity: 'high',
    })
  },
  {
    pattern: /Connection\s+refused/i,
    translation: () => ({
      originalError: 'Connection refused',
      friendlyMessage: 'The database server is refusing connections.',
      possibleSolutions: [
        'Check if the database server is running',
        'Verify that the server is configured to accept connections on the specified port',
        'Ensure firewall settings allow connections to the database port',
        'Confirm that the maximum number of database connections hasn\'t been reached'
      ],
      severity: 'high',
    })
  },
  // Authentication errors
  {
    pattern: /password authentication failed for user "(.+)"/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: `Authentication failed for database user "${matches[1]}". The password might be incorrect.`,
      possibleSolutions: [
        'Check that you\'re using the correct password',
        'Verify that the user has permission to access the database',
        'Make sure the user hasn\'t been locked out due to too many failed attempts'
      ],
      severity: 'high',
    })
  },
  // Permission errors
  {
    pattern: /permission denied for table (\w+)/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: `You don't have permission to access the table "${matches[1]}".`,
      possibleSolutions: [
        'Check that the database user has proper permissions',
        'Run "GRANT" statements to give the user access to the table',
        'Consider connecting with a different user who has the required permissions'
      ],
      severity: 'medium',
    })
  },
  // Syntax errors
  {
    pattern: /syntax error at or near "(.+)"/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: `There's a SQL syntax error near "${matches[1]}".`,
      possibleSolutions: [
        'Check your SQL query for syntax errors',
        'Make sure all keywords, table names, and field names are spelled correctly',
        'Verify that you\'re using the correct SQL dialect for your database'
      ],
      severity: 'medium',
    })
  },
  // Constraint violations
  {
    pattern: /violates unique constraint "(.+)"/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: 'This operation would create a duplicate value for a unique field.',
      possibleSolutions: [
        'Check if the record already exists before inserting',
        'Update the existing record instead of creating a new one',
        'Use a different value for the unique field'
      ],
      severity: 'medium',
      documentationLinks: [
        'https://www.postgresql.org/docs/current/ddl-constraints.html'
      ]
    })
  },
  // Foreign key violations
  {
    pattern: /violates foreign key constraint "(.+)"/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: 'This operation references a record that doesn\'t exist in another table.',
      possibleSolutions: [
        'Create the referenced record first',
        'Check if you\'re using the correct foreign key value',
        'Make sure the referenced record hasn\'t been deleted'
      ],
      severity: 'medium',
      documentationLinks: [
        'https://www.postgresql.org/docs/current/ddl-constraints.html'
      ]
    })
  },
  // Default for unrecognized database errors
  {
    pattern: /database|db|sql|query|table|column|postgres/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: 'There was an error with the database operation.',
      possibleSolutions: [
        'Check the database connection',
        'Verify that the database structure matches your code expectations',
        'Look for syntax errors in your query'
      ],
      severity: 'medium',
    })
  },
  // API errors
  {
    pattern: /fetch|api|endpoint|http|status code/i,
    translation: () => ({
      originalError: 'API Error',
      friendlyMessage: 'There was an error communicating with an API or web service.',
      possibleSolutions: [
        'Check that the API endpoint is correct',
        'Verify that your API key or authentication is valid',
        'Ensure the API service is online and functioning'
      ],
      severity: 'medium',
    })
  },
  // File system errors
  {
    pattern: /ENOENT: no such file or directory, (.+)/i,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: `The file or directory "${matches[1]}" doesn't exist.`,
      possibleSolutions: [
        'Check if the file path is correct',
        'Make sure the file hasn\'t been deleted',
        'Verify file permissions'
      ],
      severity: 'medium',
    })
  },
  // Default fallback for generic errors
  {
    pattern: /.*/,
    translation: (matches) => ({
      originalError: matches[0],
      friendlyMessage: 'An error occurred.',
      possibleSolutions: [
        'Check application logs for more details',
        'Try restarting the application',
        'Look for recent code changes that might have caused this issue'
      ],
      severity: 'low',
    })
  }
];

/**
 * Translate a technical error message into a more developer-friendly format
 */
export function translateError(errorMessage: string): ErrorTranslation {
  // If no error message is provided, return a generic translation
  if (!errorMessage) {
    return {
      originalError: 'Unknown error',
      friendlyMessage: 'An unknown error occurred.',
      possibleSolutions: [
        'Check application logs for more details',
        'Try again after a few moments'
      ],
      severity: 'medium',
    };
  }

  // Find the first matching pattern and translate the error
  for (const { pattern, translation } of errorPatterns) {
    const matches = errorMessage.match(pattern);
    if (matches) {
      return translation(matches);
    }
  }

  // Fallback for truly unrecognized errors
  return {
    originalError: errorMessage,
    friendlyMessage: 'An unexpected error occurred.',
    possibleSolutions: [
      'Check logs for more information',
      'Consult the documentation',
      'Report this issue to the development team'
    ],
    severity: 'medium',
  };
}

/**
 * Get a color class based on error severity
 */
export function getSeverityColorClass(severity: ErrorTranslation['severity']): string {
  switch (severity) {
    case 'low':
      return 'text-blue-600 dark:text-blue-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}