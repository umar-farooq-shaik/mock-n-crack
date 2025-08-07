-- Create table for storing technical interview questions
CREATE TABLE public.technical_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.technical_questions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since app is anonymous)
CREATE POLICY "Technical questions are publicly readable" 
ON public.technical_questions 
FOR SELECT 
USING (true);

-- Create policy to allow public updates (for marking questions as used)
CREATE POLICY "Technical questions can be updated publicly" 
ON public.technical_questions 
FOR UPDATE 
USING (true);

-- Create index for better performance
CREATE INDEX idx_technical_questions_topic ON public.technical_questions(topic);
CREATE INDEX idx_technical_questions_used ON public.technical_questions(used);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_technical_questions_updated_at
BEFORE UPDATE ON public.technical_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample technical questions for different topics
INSERT INTO public.technical_questions (topic, question) VALUES
-- ReactJS questions
('ReactJS', 'What is JSX?'),
('ReactJS', 'What is a hook in React?'),
('ReactJS', 'How does useEffect work?'),
('ReactJS', 'What is the virtual DOM?'),
('ReactJS', 'What are props in React?'),
('ReactJS', 'Explain the difference between state and props.'),
('ReactJS', 'What is the purpose of keys in React lists?'),
('ReactJS', 'How do you handle forms in React?'),
('ReactJS', 'What is React Context?'),
('ReactJS', 'Explain React lifecycle methods.'),

-- JavaScript questions
('JavaScript', 'Explain closures in JavaScript.'),
('JavaScript', 'What is the difference between let, const, and var?'),
('JavaScript', 'How does async/await work?'),
('JavaScript', 'What is event delegation?'),
('JavaScript', 'Explain the this keyword in JavaScript.'),
('JavaScript', 'What is prototypal inheritance?'),
('JavaScript', 'How does hoisting work?'),
('JavaScript', 'What are arrow functions?'),
('JavaScript', 'Explain promises in JavaScript.'),
('JavaScript', 'What is the event loop?'),

-- Python questions
('Python', 'What are Python decorators?'),
('Python', 'Explain list comprehensions.'),
('Python', 'What is the difference between lists and tuples?'),
('Python', 'How does Python GIL work?'),
('Python', 'What are Python generators?'),
('Python', 'Explain duck typing in Python.'),
('Python', 'What is the difference between __str__ and __repr__?'),
('Python', 'How do you handle exceptions in Python?'),
('Python', 'What are lambda functions?'),
('Python', 'Explain Python metaclasses.'),

-- Node.js questions
('Node.js', 'What is the event loop in Node.js?'),
('Node.js', 'How does Node.js handle concurrency?'),
('Node.js', 'What are middleware functions in Express?'),
('Node.js', 'How do you handle file uploads in Node.js?'),
('Node.js', 'What is the difference between process.nextTick and setImmediate?'),

-- Database questions
('Database', 'What is normalization in databases?'),
('Database', 'Explain ACID properties.'),
('Database', 'What is the difference between SQL and NoSQL?'),
('Database', 'How do database indexes work?'),
('Database', 'What are database transactions?'),

-- System Design questions
('System Design', 'How would you design a URL shortener?'),
('System Design', 'Explain load balancing strategies.'),
('System Design', 'How do you handle database scaling?'),
('System Design', 'What is caching and when to use it?'),
('System Design', 'How would you design a chat application?');

-- Create function to reset used questions for a topic
CREATE OR REPLACE FUNCTION public.reset_topic_questions(topic_name TEXT)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.technical_questions 
  SET used = false 
  WHERE topic = topic_name AND used = true;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;