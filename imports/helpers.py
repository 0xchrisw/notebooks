
def rescue_code(func):
  '''
    DESCRIPTION:
      Recover accidentally deleted functions; see also `%history`.
    USAGE:
      resuce_code({function_name})
  '''
  import inspect
  get_ipython().set_next_input("".join(inspect.getsourcelines(func)[0]))

