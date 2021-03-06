import sys
import DatabaseHelper
import Solver
import ByteArraySolver
import OldSolver
import UnreverseSolver
import Puzzle
import pickle
import time

def setList(lis, element, value, default):
	length = len(lis)
	if element < length:
		lis[element] = value
	else:
		for i in xrange(length,element):
			lis.append(default)
		lis.append(value)
	

def numBits(x):
	a = 0
	while x:
		x >>= 1
		a += 1
	return a

def solveDatabase(puzzname, passedoptions,isunreverse,solverclass):
	if puzzname.find('/') != -1 or puzzname.find('\\') != -1:
		raise ArgumentException, "invalid puzzle"

	module = __import__(puzzname)
	puzzleclass = getattr(module, puzzname)
	
	options = {}
	options.update(puzzleclass.default_options)
	options.update(passedoptions)
	print "Solving "+puzzleclass.__name__+" with options "+repr(options)[1:-1]+"..."
	puzzle = puzzleclass.unserialize(options) #.generate_start(**options) # instantiates a new puzzle object
	solver = solverclass()
	solver.solve(puzzle,verbose=True)
	
	print "Solved!  Generating array of values"
	
	return solver

def writeDatabase(puzzname, passedoptions, solver, isunreverse):
	
	if solver is None:
		return
	
	module = __import__(puzzname)
	puzzleclass = getattr(module, puzzname)

	maxlevel = solver.get_max_level()
	
	options = {}
	options.update(puzzleclass.default_options)
	options.update(passedoptions)
	print options
	
	fields =[('remoteness',numBits(maxlevel))]
	if isunreverse:
		fields.append(('score', numBits(maxlevel*2)));
	print fields
	
	bitClass = DatabaseHelper.makeBitClass(fields)
	
	CHUNKBITS=8
	CHUNK = 1<<CHUNKBITS
	
	filename = DatabaseHelper.getFileName(puzzname, options)
	print "writing to file %s"%filename
	f = open(filename, "wb")
	pickle.dump({'puzzle': puzzname,
		'options': options,
		'fields': fields,
		'version': 1,
		'maxlevel': maxlevel,
		'chunkbits': CHUNKBITS}, f)
	chunkbase = (f.tell() + (CHUNK-1)) >> CHUNKBITS
	
	default = str(bitClass(remoteness=0)) # remoteness==0 but not solution means not seen.
	
	mystr = None
	try:
		mystr = solver.getBytes()
	except:
		pass # Not a bytearray solve.  Use the normal writing functions.
	if mystr:
		f.seek(chunkbase<<CHUNKBITS)
		print "Writing %d-length buffer to disk..."%len(mystr)
		f.write(mystr)
		f.close()
		return
	try:
		print solver.maxHash
	except:
		solver.maxHash = 2**32
	maxchunks = 1 + solver.maxHash/CHUNK
	print "Maximum hash is %d, number of %d-byte chunks to write is %d"%(solver.maxHash, CHUNK, maxchunks)
	
	lasttime = starttime = time.time()
	for chunknum in xrange(0,maxchunks):
		arr = []
		for chunkoff in xrange(CHUNK):
			position = (chunknum<<CHUNKBITS)+chunkoff
			myval = solver.seen.get(position, None)
			if not myval:
				continue
			
			if isunreverse:
				print dict(remoteness=(maxlevel - myval[0]), score=myval[1])
				val = bitClass(remoteness=(maxlevel - myval[0])) #, score=myval[1])
				#print repr(str(val))
			else:
				val = bitClass(remoteness=myval)
			setList(arr, chunkoff, str(val), default)
		
		nexttime = time.time()
		pct = 100.0*float(1+chunknum)/maxchunks
		if chunknum==0:
			print "Writing first chunk out of %d to file %s"%(maxchunks,filename)
		elif nexttime - lasttime > 0.5 or chunknum==1:
			timeleft = (maxchunks-chunknum) * ((nexttime-starttime)/chunknum)
			minleft = int(timeleft/60)
			secleft = int(timeleft)%60
			print "[%3.2f%%] Writing chunk %d/%d to file %s, %d:%d minutes left"%(pct, chunknum, maxchunks, filename, minleft, secleft)
			lasttime = nexttime
		if arr:
			f.seek((chunkbase + (chunknum*bitClass.bytesize))<<CHUNKBITS)
			f.write(''.join(arr))
	
	f.close()
	print "Done!"

solver = None

solve_args = ()

# run with -i to interact with solver.
def run(name, options, unreverse, solverclass):
	global solver
	solver = solveDatabase(name, options, unreverse, solverclass)
 	writeDatabase(name, options, solver, unreverse)
	

# run with -i to use the prof variable.
def profile():
	global prof, stats, solve_args
	
	import cProfile, pstats
	prof = cProfile.Profile()
	# *solveargs is to allow passing options in... can't convert everything to repr.
	prof = prof.runctx("run(*solve_args)", globals(), locals())
	print "Done profiling!"
	stats = pstats.Stats(prof)
	stats.sort_stats("time")
	stats.print_stats(80)

if __name__=='__main__':
	#writeDatabase('Wheel',
	#	{'seqSize': 6})
	if len(sys.argv)<2:
		print >>sys.stderr, "Arguments: [-u] [-o] [-p] PythonClass option1 value1 option2 value2 ..."
		print >>sys.stderr, "\t-u: Unreverse solver"
		print >>sys.stderr, "\t-b: ByteArray solver (requires Python 2.6)"
		print >>sys.stderr, "\t-o: Old and slow solver for 'legacy' puzzles (including FCG)"
		print >>sys.stderr, "\t-p: Enable solver profiling"
		print >>sys.stderr, "\tto determine allowed options, look at default_options in PythonClass.py"
		sys.exit(0)
	args = sys.argv[1:]
	unreverse=False
	profiling=False
	solverclass = Solver.Solver
	if args[0]=="-u":
		solverclass = UnreverseSolver.UnreverseSolver
		unreverse=True
		args=args[1:]
        if args[0]=="-b":
                solverclass = ByteArraySolver.Solver
		args=args[1:]
	if args[0]=="-o":
		solverclass = OldSolver.Solver
		args=args[1:]
	if args[0]=="-p":
		profiling = True
		args=args[1:]
	
	options = {}
	for i in xrange(1,len(args)-1,2):
		options[args[i]] = args[i+1]
	
	if profiling:
		solve_args = (args[0], options, unreverse, solverclass)
		profile()
	else:
		run(args[0], options, unreverse, solverclass)

