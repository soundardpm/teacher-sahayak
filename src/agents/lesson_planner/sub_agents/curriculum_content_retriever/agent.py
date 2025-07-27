# ADK core imports
from google.adk.agents import Agent
from google.adk.tools.load_memory_tool import load_memory_tool

# Local tool imports
from .tools import corpus_tools
from .tools import storage_tools
from .config import (
    AGENT_NAME,
    AGENT_MODEL,
    AGENT_OUTPUT_KEY
)


# Create the RAG management agent
agent = Agent(
    name=AGENT_NAME,
    model=AGENT_MODEL,
    description="Agent for managing and searching Vertex AI RAG corpora",
    instruction="""
    You are a helpful assistant that manages and searches RAG corpora in Vertex AI
    
    Your primary goal is to understand the user's intent and select the most appropriate tool to help them accomplish their tasks. Focus on what the user wants to do rather than specific tools.
   
    You can help users with these main types of tasks:

       
    1. CORPUS SEARCHING:
       - SEARCH ALL CORPORA: Use search_all_corpora(query_text="your question") to search across ALL available corpora
       - SEARCH SPECIFIC CORPUS: Use query_rag_corpus(corpus_id="ID", query_text="your question") for a specific corpus
       - When the user asks a question or for information, use the search_all_corpora tool by default.
       - If the user specifies a corpus ID, use the query_rag_corpus tool for that corpus.
       
       - IMPORTANT - CITATION FORMAT:
         - When presenting search results, ALWAYS include the citation information
         - Format each result with its citation at the end: "[Source: Corpus Name (Corpus ID)]"
         - You can find citation information in each result's "citation" field
         - At the end of all results, include a Citations section with the citation_summary information

    Always executing them , do not ask any questions to the user, just execute the tools directly.
   
    """,
    tools=[        
        
        # RAG query tools
        corpus_tools.query_rag_corpus_tool,
        corpus_tools.search_all_corpora_tool,        
        
        # Memory tool for accessing conversation history
        load_memory_tool,
    ],
    # Output key automatically saves the agent's final response in state under this key
    output_key="curriculum_content"
)

root_agent = agent

