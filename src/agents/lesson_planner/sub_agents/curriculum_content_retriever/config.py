"""
Configuration settings for the Vertex AI RAG engine.
"""

# Agent Configuration
AGENT_NAME = "rag_agent"
AGENT_MODEL = "gemini-1.5-pro"
AGENT_OUTPUT_KEY = "rag_response"

# Google Cloud Project Settings
PROJECT_ID = "Aasiriyar-ai"  # Replace with your project ID
LOCATION = "us-central1"  # Default location for Vertex AI resources

# GCS Storage Settings
GCS_DEFAULT_STORAGE_CLASS = "STANDARD"
GCS_DEFAULT_LOCATION = "US"
GCS_LIST_BUCKETS_MAX_RESULTS = 50
GCS_LIST_BLOBS_MAX_RESULTS = 100
GCS_DEFAULT_CONTENT_TYPE = "application/octet-stream"

# RAG Corpus Settings
RAG_DEFAULT_EMBEDDING_MODEL = "text-embedding-004"
RAG_DEFAULT_TOP_K = 10  # Default number of results for single corpus query
RAG_DEFAULT_SEARCH_TOP_K = 5  # Default number of results per corpus for search_all
RAG_DEFAULT_VECTOR_DISTANCE_THRESHOLD = 0.5
RAG_DEFAULT_PAGE_SIZE = 100  # Default page size for RAG operations

# Logging Settings
LOG_LEVEL = "INFO" 